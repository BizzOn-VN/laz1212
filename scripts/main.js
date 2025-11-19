'use strict';

/* HELPER: Checks Whether an Element Exists
----------------------------------------------------------------------------------------------------*/
(function( $ ) {

  $.fn.extend({
    exists: function() {
      if ( this.length > 0 ) {
        return true;
      } else {
        return false;
      }
    }
  });

})( jQuery );



jQuery(document).on("ready",function () {
	
});


const cursorEl = document.getElementById("customCursor");
const cursorImg = document.getElementById("cursorImg");

// 4 ảnh con trỏ
const cursorImages = {
  cursor1: "./images/msp-1.png",
  cursor2: "./images/msp-2.png",
  cursor3: "./images/msp-3.png",
  cursor4: "./images/msp-4.png"
};

document.querySelectorAll(".cursor-box").forEach(box => {

  box.addEventListener("mouseenter", e => {
    let key = box.dataset.cursor;  
    cursorImg.src = cursorImages[key];
    cursorEl.style.display = "block";
  });

  box.addEventListener("mousemove", e => {
    cursorEl.style.transform =
      `translate(${e.clientX}px, ${e.clientY}px) translate(0%, 0%)`;
  });

  box.addEventListener("mouseleave", e => {
    cursorEl.style.display = "none";
  });

});

const parent = document.getElementById("pr-cursor-box");
const children = document.querySelectorAll(".cursor-box");

// khi click div con
children.forEach(child => {
  child.addEventListener("click", () => {

    // Xoá toàn bộ class active cũ của CHA
    parent.classList.remove("active-1", "active-2", "active-3", "active-4");

    // Lấy tên class active từ data-active của con
    const activeName = child.getAttribute("data-active");

    // Gán class cho THẰNG CHA
    parent.classList.add(activeName);
  });
});