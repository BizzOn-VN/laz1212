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


const cursorEl = document.getElementById("customCursor"); // Phần tử DIV bao ngoài
const cursorImg = document.getElementById("cursorImg");     // Ảnh chính bên trong DIV
const trailingCursor = document.getElementById("trailingCursor"); // Ảnh đi kèm

// 4 ảnh con trỏ và 4 ảnh đi kèm tương ứng
const cursorImages = {
    cursor1: {
        main: "./images/msp-1.png",
        trailing: "./images/effect-mouse-1.png" // Đường dẫn ảnh đi kèm 1
    },
    cursor2: {
        main: "./images/msp-2.png",
        trailing: "./images/effect-mouse-2.png" // Đường dẫn ảnh đi kèm 2
    },
    cursor3: {
        main: "./images/msp-3.png",
        trailing: "./images/effect-mouse-3.png" // Đường dẫn ảnh đi kèm 3
    },
    cursor4: {
        main: "./images/msp-4.png",
        trailing: "./images/effect-mouse-4.png" // Đường dẫn ảnh đi kèm 4
    }
};

document.querySelectorAll(".cursor-box").forEach(box => {

    box.addEventListener("mouseenter", e => {
        let key = box.dataset.cursor; // Lấy key (ví dụ: 'cursor1')

        // Đảm bảo key tồn tại trong cursorImages
        if (cursorImages[key]) {
            // CẬP NHẬT HÌNH ẢNH CON TRỎ CHÍNH
            cursorImg.src = cursorImages[key].main;
            
            // CẬP NHẬT HÌNH ẢNH ĐI KÈM
            if (trailingCursor) {
                trailingCursor.src = cursorImages[key].trailing;
            }
        }
        
        // HIỂN THỊ CẢ CON TRỎ CHÍNH VÀ CON TRỎ ĐI KÈM
        cursorEl.style.display = "block";
        if (trailingCursor) {
             trailingCursor.style.display = "block";
        }
    });

    box.addEventListener("mousemove", e => {
        const x = e.clientX;
        const y = e.clientY;

        // Giá trị transform để dịch chuyển và căn giữa
        const transformValue = `translate(${x}px, ${y}px) translate(-50%, -50%)`;

        // Áp dụng cho con trỏ chính
        cursorEl.style.transform = transformValue;

        // Áp dụng cho con trỏ đi kèm (nếu có)
        
    });

    box.addEventListener("mouseleave", e => {
        // ẨN CẢ CON TRỎ CHÍNH VÀ CON TRỎ ĐI KÈM
        cursorEl.style.display = "none";
        if (trailingCursor) {
             trailingCursor.style.display = "none";
        }
    });
});


const parent = document.getElementById("pr-cursor-box");
const children = document.querySelectorAll(".cursor-box");

// *** KHỞI TẠO BIẾN ĐẾM CLICK VÀ BIẾN LƯU TRỮ ***
let clickCount = 0;
let lastClickedChild = null;

// =======================================================
// === 1. XỬ LÝ LỰA CHỌN (CLICK VÀO CURSOR-BOX) ===
// =======================================================

children.forEach(child => {
    child.addEventListener("click", () => {

        // ----------------------------------------------------
        // === LOGIC XÓA ACTIVE CŨ VÀ ĐẶT LẠI KHI CLICK KHÁC DIV ===
        // ----------------------------------------------------
        // 1. Kiểm tra: Nếu lần click hiện tại KHÁC với phần tử con đã click trước đó
        if (child !== lastClickedChild) {

            // Nếu có phần tử đã được lưu trữ (tức là đã click vào một cái khác)
            if (lastClickedChild !== null) {
                // Xóa class 'active' khỏi phần tử đã click trước đó
                lastClickedChild.classList.remove("active");
            }

            // Đặt lại biến đếm
            clickCount = 0;
            // Cập nhật phần tử con đã click
            lastClickedChild = child;
        }

        // Tăng biến đếm sau mỗi lần click
        clickCount++;

        // ***************************************************************
        // *** ĐIỀU KIỆN MỚI: CHỈ XỬ LÝ LƯU CHỌN KHI MÀN HÌNH >= 768px ***
        // ***************************************************************
        if (window.innerWidth >= 768) {
             // --- Logic Xử lý CHỈ CHẠY khi clickCount >= 2 ---
             // (Khi click 2 lần liên tiếp vào CÙNG 1 phần tử)
            if (clickCount >= 2) {

                // --- Logic Xử lý Phần tử CHA ---
                parent.classList.remove("active-1", "active-2", "active-3", "active-4");
                const activeName = child.getAttribute("data-active");
                parent.classList.add(activeName);

                // --- Logic Xử lý Phần tử CON ---

                // (1. Xoá class 'active' khỏi TẤT CẢ các div con khác)
                children.forEach(c => {
                     // Chỉ xóa class active khỏi những phần tử không phải là phần tử hiện tại
                    if (c !== child) {
                        c.classList.remove("active");
                    }
                });

                // 2. Thêm class 'active' vào phần tử con vừa được click
                child.classList.add("active");

                // *** ĐẶT LẠI BIẾN ĐẾM VÀ BIẾN LƯU TRỮ ***
                clickCount = 0;
                lastClickedChild = child; // Giữ lại phần tử này để nó bị xóa ở lần chọn KHÁC tiếp theo
            }
        } else {
            // *****************************************************************
            // *** XỬ LÝ CHO MÀN HÌNH < 768px (Click ĐƠN giản, không cần đếm) ***
            // *****************************************************************

            // Trên màn hình nhỏ, giả sử bạn muốn click 1 lần là áp dụng luôn.
            // Để đảm bảo logic `clickCount >= 2` KHÔNG được áp dụng,
            // ta chỉ cần đảm bảo rằng **nếu màn hình nhỏ, ta phải thêm class 'active'
            // và áp dụng cho parent ngay lập tức** (vì logic `clickCount >= 2`
            // sẽ không được chạy).

            // Đặt lại biến đếm (vì logic clickCount là vô nghĩa trên màn hình nhỏ)
            clickCount = 0;
            lastClickedChild = child; // Cập nhật phần tử cuối cùng

            // **ÁP DỤNG KHI CLICK ĐƠN TRÊN MÀN HÌNH NHỎ (DƯỚI 768px)**
            // Logic này phải là hành vi mong muốn khi chỉ cần 1 click trên màn hình nhỏ
            parent.classList.remove("active-1", "active-2", "active-3", "active-4");
            const activeName = child.getAttribute("data-active");
            parent.classList.add(activeName);

            children.forEach(c => {
                 // Xóa class active khỏi những phần tử không phải là phần tử hiện tại
                if (c !== child) {
                    c.classList.remove("active");
                }
            });

            child.classList.add("active");
        }
    });
});

// =======================================================
// === 2. XỬ LÝ SỰ KIỆN CLICK LÊN CLASS 'active' ĐÃ ĐƯỢC THÊM VÀO ===
// =======================================================

// Sử dụng Event Delegation: Lắng nghe sự kiện click trên toàn bộ document.
// Khi click xảy ra, kiểm tra xem click có trúng vào phần tử có class 'active' không.


document.addEventListener('DOMContentLoaded', () => {
    // Lấy tất cả các ô input OTP
    const inputs = document.querySelectorAll('.code-input');

    // Lặp qua từng ô input để thêm sự kiện
    inputs.forEach((input, index) => {
        
        // --- 1. Xử lý khi nhập liệu (Tự động chuyển tiếp) ---
        /* input.addEventListener('input', (event) => {
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
        }); */
        
        // --- 2. Xử lý khi nhấn Backspace/Delete (Tự động quay lại) ---
        /* input.addEventListener('keyup', (event) => {
            // Kiểm tra phím xóa (Backspace)
            if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 8) {
                // Nếu ô hiện tại bị trống sau khi xóa VÀ không phải ô đầu tiên
                if (input.value.length === 0 && index > 0) {
                    // Chuyển focus về ô trước đó
                    inputs[index - 1].focus();
                    
                    // Tùy chọn: chọn (select) nội dung trong ô trước đó để người dùng có thể xóa tiếp
                    inputs[index - 1].select(); 
                }
            }
        }); */
        // --- 3. Xử lý Dán (Paste) nhiều ký tự vào ô đầu tiên (Tùy chọn) ---
        // Giúp người dùng dán toàn bộ mã OTP từ clipboard
        input.addEventListener('paste', (event) => {
            // Chỉ xử lý nếu đang focus vào ô input đầu tiên
            if (index === 0) {
                // Ngăn chặn hành vi dán mặc định
                event.preventDefault(); 
                
                // Lấy dữ liệu dán và loại bỏ các ký tự không phải số
                const pasteData = event.clipboardData.getData('text').trim(); 
                
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
    const addRightClass = () => {
        otpContainer.classList.add('active-1');
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
            addRightClass();
            
            // ⭐️ HÀNH ĐỘNG 2: PHÁT ÂM THANH THÀNH CÔNG
            playSuccessSound(); 
            
            // HÀNH ĐỘNG 1: Thêm class vào body để kích hoạt hiệu ứng đóng trang
            if (targetElement) {
              setTimeout(() => {
                targetElement.classList.add('page-exit');
            }, 1000);
                
            }

            // Chờ hiệu ứng chạy xong rồi chuyển hướng (0.5 giây)
            setTimeout(() => {
                window.location.replace(NEXT_PAGE_URL);
            }, 1500);

        } else {
            // MÃ SAI
            addErrorClass();
        }
    };

    // --- Logic Tương tác Input (Giữ nguyên) ---
    inputs.forEach((input, index) => {
        // Tự động chuyển tiếp khi nhập xong 1 ký tự
        input.addEventListener('input', () => {
            if (index == 4) {
                let code5 = inputs[index].value;
                if (isNaN(code5)) {
                    // console.log('chữ');
                    changeInputsToNumber("text");
                } else {
                    // console.log('số');
                    changeInputsToNumber("number");
                }
            } else {
                
            }

            removeErrorClass();
            
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Tự động quay lại khi nhấn Backspace
        input.addEventListener('keydown', (event) => {
            if ((event.key === 'Backspace' || event.key === 8) && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
            console.log(event.key);
            if (event.key === 'Enter' || event.key === 13) {
                handleSubmission(event);
            }
        });

    });

    //
    const changeInputsToNumber = (type) => {
        console.log(type);
        inputs.forEach((input, index) => {
            if (index >= 5) {
                if(type == "number") {
                    input.setAttribute('pattern', "[0-9]*")
                } else {
                    input.setAttribute('pattern', "[A-Za-z0-9]*")
                }
            }
        })
    }

    // Gắn sự kiện cho Nút Xác Nhận
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmission);
    }
});


document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.page-step-2 .md-row'); // Lấy container cha
  const allCols = document.querySelectorAll('.page-step-2 .md-col');
  
  allCols.forEach(clickedCol => {
    // Lấy tên class định danh của cột đang được click (ví dụ: 'md-col-A')
    // và chuyển thành tên class điều khiển (ví dụ: 'hovering-on-A')
    const colName = Array.from(clickedCol.classList).find(c => c.startsWith('md-col-'));
    const controlClass = colName ? colName.replace('md-col-', 'hovering-on-') : '';

    // --- Xử lý khi chuột click (click) ---
    clickedCol.addEventListener('click', function() {
      if (controlClass) {
        // 1. Xóa TẤT CẢ các class 'hovering-on-*' hiện có trên container
        //    Đây là bước quan trọng để đảm bảo chỉ có một class được thêm vào
        removeAllHoveringClasses(container);

        // 2. Thêm class điều khiển mới vào container cha
        container.classList.add(controlClass); 
      }
    });
  });

  /**
   * Hàm hỗ trợ xóa tất cả các class bắt đầu bằng 'hovering-on-'
   * khỏi một phần tử.
   */
  function removeAllHoveringClasses(element) {
    // Chuyển ClassList thành Array để có thể lặp qua và xóa
    const classesToRemove = Array.from(element.classList).filter(className => 
      className.startsWith('hovering-on-')
    );
    
    classesToRemove.forEach(className => {
      element.classList.remove(className);
    });
  }
});


new WOW().init();

// $(document).ready(function() {
//     $('.md-row').on('click', function(){
//         const $clickedElementRow = $('.md-row');
//         if ($clickedElementRow.is('.active-1, .active-2, .active-3, .active-4')){
//             $('.md-col').on('click', function() {

//             const $clickedElement = $(this);
//             const $targetProduct = $('.md-product'); // Mục tiêu để thêm class
//             const cursor = document.querySelector('.md-cursor');
//             const btn_cf = document.querySelector('.btn-cf');
//             const customcursor = document.querySelector('.custom-cursor');
//             const md_text_3 = document.querySelector('.md-text-3');
//             const ico_3 = document.querySelector('.img-ico-3');
//             document.addEventListener('click', () => {
//                       md_text_3.classList.add('active-title');
//                     });
//                 // 1. Kiểm tra xem đã có 'product' chưa (Tức là Click 3 trở đi)
//                 if ($targetProduct.hasClass('product')) {
//                     // TRƯỜNG HỢP 3: Đã có 'product' -> Thêm 'active-product'
                    
//                     console.log('Click Lần 3: Đang thêm class "active-product"');
//                     $targetProduct.addClass('active-product');

//                     // Tùy chọn: Reset tất cả trạng thái nếu muốn bắt đầu lại chu trình
//                     // $clickedElement.removeClass('active-child');
//                     // $targetProduct.removeClass('product active-product'); 
                    
//                 } 
                
//                 // 2. Kiểm tra xem đã có 'active-child' chưa (Tức là Click 2)
//                 // else if ($clickedElement.hasClass('active-child')) {
//                 //     // TRƯỜNG HỢP 2: Đã có 'active-child' nhưng chưa có 'product' -> Thêm 'product'
                    
//                 //     console.log('Click Lần 2: Đang thêm class "product"');
                    

//                 // } 
                
//                 // 3. Nếu không có cả hai (Tức là Click 1)
//                 else {
//                     // TRƯỜNG HỢP 1: Chưa có gì -> Thêm 'active-child'
                    
//                     $targetProduct.addClass('active-product');
//                     btn_cf.classList.add('active-btncf');
//                     document.addEventListener('click', () => {
//                       cursor.classList.add('active');
                      
//                     });
//                     document.addEventListener('click', () => {
//                       ico_3.classList.add('active-ico');
                      
//                     });
                    
//                     $clickedElement.addClass('active-none');
//                     document.addEventListener('click', () => {
//                       setTimeout(() => {
//                         customcursor.classList.add('active-custom');
//                     }, 500);
//                     });
                    

//                     $clickedElement.addClass('active-child');
//                 }
            
//         });
//         }
//     });

    
    
// });



$(document).ready(function() {

    // Gán thời gian chờ (đơn vị: mili-giây). Ví dụ: 500ms = 0.5 giây
    const DELAY_TIME = 1500; 

    // Gắn sự kiện CLICK cho TẤT CẢ các cột có class 'md-col'
    $('.md-col').on('click', function(e) {
        
        // Lấy phần tử cha gần nhất có class 'md-row'
        const $thisCol = $(this);
        const $parentRow = $thisCol.closest('.md-row');
        
        // Kiểm tra xem .md-row có class active hợp lệ (active-1 đến active-4) không
        const isActiveRow = $parentRow.hasClass('active-1') || 
                            $parentRow.hasClass('active-2') ||
                            $parentRow.hasClass('active-3') ||
                            $parentRow.hasClass('active-4');
        
        // ----------------------------------------------------
        
        // CHỈ chuyển trang nếu đã có class active
        if (isActiveRow) {
            
            // Lấy đường dẫn trang đích từ thuộc tính data-target của CỘT đang được click
            const targetPage = $thisCol.data('target'); 
            
            // Kiểm tra đường dẫn có tồn tại không
            if (targetPage) {
                
                // 1. (TÙY CHỌN) Thêm class hiệu ứng ngay lập tức
                //    Ví dụ: Thêm class 'clicked' để cột sáng lên hoặc chớp tắt
                // $thisCol.addClass('is-loading'); 
                
                console.log(`Đã kiểm tra class. Đang chờ ${DELAY_TIME}ms trước khi chuyển trang...`);

                // 2. Sử dụng setTimeout để tạo độ trễ trước khi chuyển trang
                setTimeout(function() {
                    // Thực hiện chuyển hướng sau khi hết thời gian chờ
                    window.location.href = targetPage;
                }, DELAY_TIME); // Độ trễ được định nghĩa ở trên
                
            } else {
                console.error("Lỗi: md-col đang thiếu thuộc tính data-target!");
            }
        } 
        // Nếu không có class active, không làm gì cả.
    });
});
// Đợi cho toàn bộ nội dung HTML được tải xong
