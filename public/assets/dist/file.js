var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

// call this to Disable
function disableScroll() {
  window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

const position = { x: 0, y: 0 };

interact(".img-fluid").draggable({
  listeners: {
    start(event) {
      // console.log(event.type, event.target);
    },

    move(event) {
      position.x += event.dx;
      position.y += event.dy;
      $("#html-content-holder").css(
        "background-position",
        position.x + "px " + position.y + "px"
      );
      disableScroll();
    },
  },
});

$(document).ready(function () {
  checkID();
  document
    .getElementById("imgfarmer")
    .addEventListener("touchstart", disableScroll);
  document
    .getElementById("imgfarmer")
    .addEventListener("touchend", enableScroll);
  var namafilenyaq =
    Date.now() +
    "_" +
    localStorage.getItem("deviceIDi") +
    "_" +
    generateString(17);
  $("#namaupload").val(namafilenyaq);
  $("#hidden_datanama").val(namafilenyaq);
  $("#hidden_datauser").val(localStorage.getItem("deviceIDi"));
  $("#hidden_fullname").val(localStorage.getItem("nama"));
  $("#hidden_noreg").val(localStorage.getItem("noreg"));
  var typenya = $("#imgfarmer").attr("data-id");
  $("#hidden_datatype").val(typenya);

  $(".pilihanimag").click(function () {
    var gambarnew = $(this).attr("src");
    var namafilenyag =
      localStorage.getItem("deviceIDi") + "_" + generateString(15);
    $("#namaupload").val(namafilenyag);
    $("#hidden_datanama").val(namafilenyag);
    $("#imgfarmer").attr("src", gambarnew);

    var typenya = $(this).attr("data-id");
    $("#hidden_datatype").val(typenya);
  });

  $("#customRange3").on("change", valueUpdated3);

  // Logs the value while the user is moving the slider
  $("#customRange3").on("input", valueUpdated3);

  function valueUpdated3(e) {
    var val = $("#customRange3").val();

    $("#html-content-holder").css(
      "background-size",
      100 + (100 * val) / 110 + "%"
    );
  }
});

$("input[name='FileOne']").on("change", function (event1) {
  var namafilenya =
    localStorage.getItem("deviceIDi") + "_" + generateString(15);
  $("#namaupload").val(namafilenya);
  $("#hidden_datanama").val(namafilenya);
  $("#customRange3").show();

  $("#modfinis").html(" ");
  src1 = URL.createObjectURL(event1.target.files[0]);
  document.querySelector("[for=FileOne]").style.backgroundImage =
    "url(" + src1 + ")";
  $("#html-content-holder").css("background-size", "cover");
  $("#btn_convert").show();
});

document.getElementById("btn_convert").addEventListener("click", function () {
  $("#btn_convert").hide();
  $("#barload").show();
  $("#customRange3").hide();
  //$("#modolna").click();
  html2canvas(document.getElementById("html-content-holder"), {
    allowTaint: true,
    useCORS: true,
  }).then(function (canvas) {
    var anchorTag = document.createElement("a");
    var namafile = $("#namaupload").val() + ".jpg";
    document.body.appendChild(anchorTag);
    document.getElementById("previewImg").appendChild(canvas);
    anchorTag.download = namafile;
    anchorTag.href = canvas.toDataURL();
    anchorTag.target = "_blank";
    anchorTag.click();

    var namamedia =
      Date.now() + localStorage.getItem("deviceIDi") + "_" + generateString(15);
    var dataURL = canvas.toDataURL();
    var namamedia =
      localStorage.getItem("deviceIDi") + "_" + generateString(15);
    var dataURL = canvas.toDataURL();

    // ambil data JSON dari local storage
    var mymedia = localStorage.getItem("myMEDIA");

    // jika nilai mymedia adalah null atau undefined, buat objek baru dengan array kosong
    if (!mymedia) {
      mymedia = JSON.stringify({
        items: [],
      });
    } else {
      // konversi data JSON menjadi objek JavaScript
      var mymediaObject = JSON.parse(mymedia);

      // jika nilai mymediaObject.items adalah undefined, buat array baru
      if (!mymediaObject.items) {
        mymediaObject.items = [];
      }

      // tambahkan item baru ke dalam array
      mymediaObject.items.push({ id: namamedia, data: dataURL });

      // konversi objek JavaScript menjadi JSON string
      mymedia = JSON.stringify(mymediaObject);
    }

    // simpan data JSON yang telah diperbarui kembali ke local storage
    localStorage.setItem("myMEDIA", mymedia);

    var datasend = JSON.stringify({
      id: namamedia,
      data: dataURL,
    });
    var settings = {
      url: "/media",
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: datasend,
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      $("#barload").hide();
    });

    $("#modte").html(
      "File Telah di download silahkan Check di Folder Download browser"
    );

    // $("#upsum").click();
  });
});
