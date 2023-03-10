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
    localStorage.getItem("deviceIDi") + "_" + generateString(15);
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

  $("#bwee").submit(function (event) {
    $("#barload").show();
    $("#bwee").hide();
    var nama1 = $("#hidden_fullname").val();
    var nama2 = $("#hidden_noreg").val();
    localStorage.setItem("nama", nama1);
    localStorage.setItem("noreg", nama2);
    console.log("SUBMIT" + nama2);
    $("#framesub").on("load", function () {
      $("#barload").hide();
      console.log("terkirim");
      $("#modfinis").html(
        "File Telah telah terkirim silahkan buat foto bingkai lagi"
      );
      $("#hidden_fullname").val(localStorage.getItem("nama"));
      $("#hidden_noreg").val(localStorage.getItem("noreg"));
    });
  });
});

$("input[name='FileOne']").on("change", function (event1) {
  var namafilenya =
    localStorage.getItem("deviceIDi") + "_" + generateString(15);
  $("#namaupload").val(namafilenya);
  $("#hidden_datanama").val(namafilenya);
  $("#customRange3").show();
  $("#bwee").hide();
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
    var dataURL = canvas.toDataURL();
    document.getElementById("hidden_data").value = dataURL;
    $("#barload").hide();
    $("#bwee").show();
    //$( "#bwee" ).submit();

    $("#modte").html(
      "File Telah di download silahkan Check di Folder Download browser"
    );

    // $("#upsum").click();
  });
});
