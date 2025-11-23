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


document.addEventListener('DOMContentLoaded', () => {
    // Lấy tất cả các ô input OTP
    const inputs = document.querySelectorAll('.code-input');

    // Lặp qua từng ô input để thêm sự kiện
    inputs.forEach((input, index) => {
        
        // --- 1. Xử lý khi nhập liệu (Tự động chuyển tiếp) ---
        input.addEventListener('input', (event) => {
            // Kiểm tra xem đã nhập ký tự nào chưa (maxlength="1" nên chỉ có 1 ký tự)
            if (input.value.length === 1 && index < inputs.length - 1) {
                // Nếu không phải ô cuối cùng, chuyển focus sang ô tiếp theo
                inputs[index + 1].focus();
            }
            
            // Xử lý khi mã OTP đã được nhập đủ (tùy chọn)
            if (index === inputs.length - 1 && input.value.length === 1) {
                console.log("Mã OTP đã được nhập đầy đủ.");
                // Thực hiện hành động tiếp theo, ví dụ: gửi form
                // submitOTP();
            }
        });
        
        // --- 2. Xử lý khi nhấn Backspace/Delete (Tự động quay lại) ---
        input.addEventListener('keydown', (event) => {
            // Kiểm tra xem phím nhấn có phải là Backspace không
            if (event.key === 'Backspace' && input.value.length === 0 && index > 0) {
                // Nếu ô hiện tại trống và không phải ô đầu tiên, chuyển focus về ô trước
                inputs[index - 1].focus();
            }
        });
        
        // --- 3. Xử lý Dán (Paste) nhiều ký tự vào ô đầu tiên (Tùy chọn) ---
        // Giúp người dùng dán toàn bộ mã OTP từ clipboard
        input.addEventListener('paste', (event) => {
            // Chỉ xử lý nếu đang focus vào ô input đầu tiên
            if (index === 0) {
                // Ngăn chặn hành vi dán mặc định
                event.preventDefault(); 
                
                // Lấy dữ liệu dán và loại bỏ các ký tự không phải số
                const pasteData = event.clipboardData.getData('text').trim().replace(/\D/g, ''); 
                
                // Điền dữ liệu vào các ô
                for (let i = 0; i < pasteData.length && i < inputs.length; i++) {
                    inputs[i].value = pasteData[i];
                }
                
                // Chuyển focus đến ô cuối cùng hoặc ô tiếp theo sau khi dán
                if (pasteData.length < inputs.length) {
                    inputs[pasteData.length].focus();
                } else {
                    inputs[inputs.length - 1].focus();
                }
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {

    // ⭐️ KHU VỰC CẦN CỐ ĐỊNH: Danh sách mã hợp lệ (Hardcoded cho mục đích Demo/Test)
    const VALID_CODES = ["1212STCN", "11122000"];
    const CODE_LENGTH = VALID_CODES[0].length;
    const NEXT_PAGE_URL = "./step-2.html";
    // -------------------------------------------------------------------------

    const otpContainer = document.querySelector('.md-form');
    const inputs = document.querySelectorAll('.code-input');
    const submitButton = document.querySelector('.md-text-2');
    const targetElement = document.querySelector('.page-main');
    
    // Lấy phần tử âm thanh lỗi và âm thanh thành công
    const errorSound = document.getElementById('errorSound'); 
    const successSound = document.getElementById('successSound'); // THÊM

    // Hàm Thu thập Mã từ các ô input
    const getEnteredCode = () => {
        return Array.from(inputs).map(input => input.value).join('').toUpperCase();
    };
    
    // Hàm Phát Âm thanh Lỗi
    const playErrorSound = () => {
        if (errorSound) {
            errorSound.currentTime = 0; 
            errorSound.play().catch(error => {
                console.warn("Không thể phát âm thanh lỗi: ", error);
            });
        }
    };
    
    // THÊM: Hàm Phát Âm thanh Thành công
    const playSuccessSound = () => {
        if (successSound) {
            successSound.currentTime = 0; 
            successSound.play().catch(error => {
                console.warn("Không thể phát âm thanh thành công: ", error);
            });
        }
    };

    // Hàm Xóa Lỗi và thông báo
    const removeErrorClass = () => {
        otpContainer.classList.remove('active');
    };

    // Hàm Thêm Lỗi, xóa mã và focus lại
    const addErrorClass = () => {
        otpContainer.classList.add('active');
        inputs.forEach(input => input.value = '');
        inputs[0].focus();
        playErrorSound(); 
    };

    // --- Hàm Logic Xác nhận (ĐÃ CẬP NHẬT) ---
    const handleSubmission = (event) => {
        event.preventDefault(); // Ngăn form gửi đi

        const enteredCode = getEnteredCode();

        // 1. Kiểm tra độ dài mã
        if (enteredCode.length !== CODE_LENGTH) {
            addErrorClass();
            return;
        }

        // 2. So sánh mã
        if (VALID_CODES.includes(enteredCode)) {
            // MÃ ĐÚNG:
            removeErrorClass();
            
            // ⭐️ HÀNH ĐỘNG 2: PHÁT ÂM THANH THÀNH CÔNG
            playSuccessSound(); 
            
            // HÀNH ĐỘNG 1: Thêm class vào body để kích hoạt hiệu ứng đóng trang
            if (targetElement) {
                targetElement.classList.add('page-exit');
            }

            // Chờ hiệu ứng chạy xong rồi chuyển hướng (0.5 giây)
            setTimeout(() => {
                window.location.replace(NEXT_PAGE_URL);
            }, 500);

        } else {
            // MÃ SAI
            addErrorClass();
        }
    };

    // --- Logic Tương tác Input (Giữ nguyên) ---
    inputs.forEach((input, index) => {
        // Tự động chuyển tiếp khi nhập xong 1 ký tự
        input.addEventListener('input', () => {
            removeErrorClass(); 
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Tự động quay lại khi nhấn Backspace
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    // Gắn sự kiện cho Nút Xác Nhận
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmission);
    }
});


document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.page-step-2 .md-row'); // Lấy container cha
  const allCols = document.querySelectorAll('.page-step-2 .md-col');
  
  allCols.forEach(hoveredCol => {
    // Lấy tên class định danh của cột đang được hover (ví dụ: 'col-A')
    // và chuyển thành tên class điều khiển (ví dụ: 'hovering-on-A')
    const colName = Array.from(hoveredCol.classList).find(c => c.startsWith('md-col-'));
    const controlClass = colName ? colName.replace('md-col-', 'hovering-on-') : '';

    // --- Xử lý khi chuột đi vào (mouseenter) ---
    hoveredCol.addEventListener('mouseenter', function() {
      if (controlClass) {
        // Thêm class điều khiển vào container cha
        container.classList.add(controlClass); 
      }
    });

    // --- Xử lý khi chuột đi ra (mouseleave) ---
    hoveredCol.addEventListener('mouseleave', function() {
      if (controlClass) {
        // Xóa class điều khiển khỏi container cha
        container.classList.remove(controlClass); 
      }
    });
  });
});


new WOW().init();
