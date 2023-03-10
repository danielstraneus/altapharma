document.querySelector("#myInput").addEventListener("click", () => {
  document.querySelector(".sortable").classList.add("opacity");
});
document.querySelector("#myInput").addEventListener("focus", () => {
  document.querySelector(".sortable").classList.add("opacity");
});

document.querySelector("#myInput").addEventListener("blur", () => {
  document.querySelector(".sortable").classList.remove("opacity");
});

// document.querySelector("#menu").classList.toggle("hi");

document.querySelector("#info").addEventListener("click", () => {
  document.querySelector("#menu").classList.toggle("hi");
  document.querySelector("#myInput").classList.toggle("bye");
  document.querySelector("#company").classList.toggle("bye");
  document.querySelector("#industry").classList.toggle("bye");
  document.querySelector("#founded").classList.toggle("bye");
  document.querySelector("#revenue").classList.toggle("bye");
  document.querySelector("#country").classList.toggle("bye");
  document.querySelector("#city").classList.toggle("bye");
  document.querySelector("#website").classList.toggle("bye");
});

var input = document.getElementById("myInput");
input.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.querySelector(".sortable").classList.remove("opacity");
  }
});

// SORT //

document.addEventListener("click", function (e) {
  try {
    // allows for elements inside TH
    function findElementRecursive(element, tag) {
      return element.nodeName === tag
        ? element
        : findElementRecursive(element.parentNode, tag);
    }

    var descending_th_class = " dir-d ";
    var ascending_th_class = " dir-u ";
    var ascending_table_sort_class = "asc";
    var regex_dir = / dir-(u|d) /;
    var regex_table = /\bsortable\b/;
    var alt_sort = e.shiftKey || e.altKey;
    var element = findElementRecursive(e.target, "TH");
    var tr = findElementRecursive(element, "TR");
    var table = findElementRecursive(tr, "TABLE");

    function reClassify(element, dir) {
      element.className = element.className.replace(regex_dir, "") + dir;
    }

    function getValue(element) {
      // If you aren't using data-sort and want to make it just the tiniest bit smaller/faster
      // comment this line and uncomment the next one
      var value =
        (alt_sort && element.getAttribute("data-sort-alt")) ||
        element.getAttribute("data-sort") ||
        element.innerText;
      return value;
      // return element.innerText
    }
    if (regex_table.test(table.className)) {
      var column_index;
      var nodes = tr.cells;

      // Reset thead cells and get column index
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] === element) {
          column_index = element.getAttribute("data-sort-col") || i;
        } else {
          reClassify(nodes[i], "");
        }
      }

      var dir = descending_th_class;

      // Check if we're sorting ascending or descending
      if (
        element.className.indexOf(descending_th_class) !== -1 ||
        (table.className.indexOf(ascending_table_sort_class) !== -1 &&
          element.className.indexOf(ascending_th_class) == -1)
      ) {
        dir = ascending_th_class;
      }

      // Update the `th` class accordingly
      reClassify(element, dir);

      // loop through all tbodies and sort them
      for (var i = 0; i < table.tBodies.length; i++) {
        const org_tbody = table.tBodies[i];

        // Get the array rows in an array, so we can sort them...
        var rows = [].slice.call(org_tbody.rows, 0);

        var reverse = dir === ascending_th_class;

        // Sort them using Array.prototype.sort()
        rows.sort(function (a, b) {
          var x = getValue((reverse ? a : b).cells[column_index]);
          var y = getValue((reverse ? b : a).cells[column_index]);
          var bool =
            x.length && y.length && !isNaN(x - y) ? x - y : x.localeCompare(y);
          return bool;
        });

        // Make a clone without content
        var clone_tbody = org_tbody.cloneNode();

        // Fill it with the sorted values
        while (rows.length) {
          clone_tbody.appendChild(rows.splice(0, 1)[0]);
        }

        // And finally replace the unsorted table with the sorted one
        table.replaceChild(clone_tbody, org_tbody);
      }
    }
  } catch (error) {
    // console.log(error)
  }
});

// SEARCH //

function searchTable() {
  var input, filter, found, table, tr, td, i, j;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();

  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    for (j = 0; j < td.length; j++) {
      if (
        td[j].innerHTML.toUpperCase().indexOf(filter) > -1 &&
        input.value.length > 2
      ) {
        found = true;
      }
    }
    if (found) {
      tr[i].style.display = "";
      found = false;
    } else if (input.value.length < 3) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          console.log(input.value);
          if (inp.value === "JOHNSON & JOHNSON") {
            inp.value = "Johnson Johnson";
          }
          if (inp.value === "MERCK & CO") {
            inp.value = "MERCK CO";
          }
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
          console.log(input.value);
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    console.log(input.value);
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      closeAllLists(e);

      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });

  // closeAllLists(e.target);
}

/*An array containing all the country names in the world:*/
var countries = [
  "JOHNSON & JOHNSON",
  "PFIZER",
  "ROCHE",
  "ABBVIE",
  "NOVARTIS",
  "MERCK & CO",
  "BRISTOL-MYERS SQUIBB",
  "SANOFI",
  "GLAXOSMITHKLINE",
  "ASTRAZENECA",
  "TAKEDA",
  "ELI LILLY AND COMPANY",
  "BAYER",
  "GILEAD SCIENCE",
  "AMGEN",
  "BOEHRINGER INGELHEIM",
  "NOVO NORDISK",
  "BIONTECH",
  "MODERNA",
  "VIATRIS",
  "ABBOTT",
  "BIOGEN",
  "ALCON",
  "ZOETIS",
  "ADCOCK INGRAM",
  "B. BRAUN",
  "SUN PHARMA",
  "BAUSCH + LOMB",
  "PERRIGO",
  "VERTEX",
  "SHIONOGI",
  "PURDUE",
  "AUROBINDO",
  "CHIESI",
  "ALKERMES",
  "ACI LIMITED",
  "Bausch Health",
  "Biocon Limited",
  "BioCryst",
  "BioMarin",
  "bioMérieux",
  "Bosnalijek",
  "BTG Limited",
  "Zydus",
  "Almirall",
  "Alnylam",
  "Altana",
  "AryoGen",
  "Baxter",
  "Capsugel",
  "Catalent",
  "Celgene",
  "Cipla",
  "Clovis",
  "CSL",
  "CureVac",
  "Daiichi Sankyo",
  "Dentsply Sirona",
  "Dr. Reddy's",
  "Emergent",
  "Emcure",
  "Endo",
  "FAREVA",
  "GALDERMA",
  "Gedeon Richter",
  "Grifols",
  "Hemispherx",
  "Gedeon Richter",
  "Hikma",
  "Hisamitsu",
  "Horizon",
  "Intas",
  "ionis",
  "Jazz",
  "Incyte",

  "Spain",
  "USA",
  "Hungary",
  "England",
  "UK",
  "Japan",
  "Ireland",
  "India,",

  "Barcelona",
  "Bristol",
  "Ocala",
  "Florida",
  "Budapest",
  "London",
  "Tosu",
  "Dublin",
  "Ahmedabad",
  "Carlsbad",

  "PHARMACEUTICAL",
  "DENTAL EQUIPMENT",
  "BIOPHARMACEUTICAL",
  "HEALTHCARE",
  "BIOTECHNOLOGY",
  "CHEMICALS",
  "MEDICAL DEVICES",
  "OPHTHALMOLOGY",
];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), countries);

let columns = 4;

let compExist = true;
let induExist = true;
let founExist = true;
let reveExist = true;
let landExist = false;
let townExist = false;
let websExist = false;

const compItems = [...document.getElementsByClassName("comp")];
const induItems = [...document.getElementsByClassName("indu")];
const founItems = [...document.getElementsByClassName("foun")];
const reveItems = [...document.getElementsByClassName("reve")];
const landItems = [...document.getElementsByClassName("land")];
const townItems = [...document.getElementsByClassName("town")];
const websItems = [...document.getElementsByClassName("webs")];

landItems.forEach((landItem) => {
  landItem.classList.toggle("visible");
  if (landItem.classList.contains("visible")) {
    landExist = true;
  } else {
    landExist = false;
  }
});
townItems.forEach((townItem) => {
  townItem.classList.toggle("visible");
  if (townItem.classList.contains("visible")) {
    townExist = true;
  } else {
    townExist = false;
  }
});
websItems.forEach((websItem) => {
  websItem.classList.toggle("visible");
  if (websItem.classList.contains("visible")) {
    websExist = true;
  } else {
    websExist = false;
  }
});

document.querySelector("#country").classList.toggle("visible");
document.querySelector("#city").classList.toggle("visible");
document.querySelector("#website").classList.toggle("visible");

document.querySelector("#comp").addEventListener("click", () => {
  document.querySelector("table").classList.remove("column-" + columns);
  document.querySelector("#company").classList.toggle("visible");

  compItems.forEach((compItem) => {
    compItem.classList.toggle("visible");
    if (compItem.classList.contains("visible")) {
      compExist = true;
    } else {
      compExist = false;
    }
  });
  if (compExist === true) {
    columns = columns - 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  } else {
    columns = columns + 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  }
});

document.querySelector("#indu").addEventListener("click", () => {
  document.querySelector("table").classList.remove("column-" + columns);
  document.querySelector("#industry").classList.toggle("visible");

  induItems.forEach((induItem) => {
    induItem.classList.toggle("visible");
    if (induItem.classList.contains("visible")) {
      induExist = true;
    } else {
      induExist = false;
    }
  });
  if (induExist === true) {
    columns = columns - 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  } else {
    columns = columns + 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  }
});

document.querySelector("#foun").addEventListener("click", () => {
  document.querySelector("table").classList.remove("column-" + columns);
  document.querySelector("#founded").classList.toggle("visible");

  founItems.forEach((founItem) => {
    founItem.classList.toggle("visible");
    if (founItem.classList.contains("visible")) {
      founExist = true;
    } else {
      founExist = false;
    }
  });
  if (founExist === true) {
    columns = columns - 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  } else {
    columns = columns + 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  }
});

document.querySelector("#reve").addEventListener("click", () => {
  document.querySelector("table").classList.remove("column-" + columns);
  document.querySelector("#revenue").classList.toggle("visible");

  reveItems.forEach((reveItem) => {
    reveItem.classList.toggle("visible");
    if (reveItem.classList.contains("visible")) {
      reveExist = true;
    } else {
      reveExist = false;
    }
  });
  if (reveExist === true) {
    columns = columns - 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  } else {
    columns = columns + 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  }
});

document.querySelector("#land").addEventListener("click", () => {
  document.querySelector("table").classList.remove("column-" + columns);
  document.querySelector("#country").classList.toggle("visible");

  landItems.forEach((landItem) => {
    landItem.classList.toggle("visible");
    if (landItem.classList.contains("visible")) {
      landExist = true;
    } else {
      landExist = false;
    }
  });
  if (landExist === true) {
    columns = columns - 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  } else {
    columns = columns + 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  }
});

document.querySelector("#town").addEventListener("click", () => {
  document.querySelector("table").classList.remove("column-" + columns);
  document.querySelector("#city").classList.toggle("visible");

  townItems.forEach((townItem) => {
    townItem.classList.toggle("visible");
    if (townItem.classList.contains("visible")) {
      townExist = true;
    } else {
      townExist = false;
    }
  });
  if (townExist === true) {
    columns = columns - 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  } else {
    columns = columns + 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  }
});
document.querySelector("#webs").addEventListener("click", () => {
  document.querySelector("table").classList.remove("column-" + columns);
  document.querySelector("#website").classList.toggle("visible");

  websItems.forEach((websItem) => {
    websItem.classList.toggle("visible");
    if (websItem.classList.contains("visible")) {
      websExist = true;
    } else {
      websExist = false;
    }
  });
  if (websExist === true) {
    columns = columns - 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  } else {
    columns = columns + 1;
    document.querySelector("table").classList.toggle("column-" + columns);
  }
});
