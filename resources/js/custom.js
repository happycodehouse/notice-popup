const popup = document.getElementById('mainPopup');
const cookieName = `hide_${popup.id}`;
const maxSlides = 3;
const slideImages = ['audition-01.jpg', 'audition-02.jpg', 'audition-03.jpg'];
let slideCount = 1;

const addBtn = document.querySelector('[data-action="add"]');
const removeBtn = document.querySelector('[data-action="remove"]');
const resetBtn = document.querySelector('[data-action="reset"]');

function setCookie(name, value) {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function isWithinSchedule(open, close) {
    const now = new Date();
    return now >= open && now <= close;
}

function parseScheduleDate(str) {
    return new Date(str.replace(/-/g, '/'));
}

// 데모용 오버라이드: 접속 시간 기준으로 항상 표시되게 함
// 배포 시 이 블록을 지우고 아래 실제 값 두 줄을 사용
const now = new Date();
const openDate = new Date(now.getTime() - 60 * 1000);
const closeDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

// 실제 배포용 (data-open/data-close 사용 시 위 데모 블록 대신 아래 사용)
// const openDate = parseScheduleDate(popup.dataset.open);
// const closeDate = parseScheduleDate(popup.dataset.close);

const shouldShow = isWithinSchedule(openDate, closeDate) && !getCookie(cookieName);

if (!shouldShow) {
    popup.style.display = 'none';
}

const swiper = new Swiper('.swiper', {
    autoHeight: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

function updateSwiperState() {
    const isSingle = slideCount <= 1;
    swiper.allowTouchMove = !isSingle;
    swiper.pagination.el.style.display = isSingle ? 'none' : '';
    swiper.update();

    addBtn.disabled = slideCount >= maxSlides;
    removeBtn.disabled = slideCount <= 1;
}

updateSwiperState();

popup.querySelector('.popup_close').addEventListener('click', () => {
    if (document.getElementById('chkToday').checked) {
        setCookie(cookieName, 'true');
    }
    popup.style.display = 'none';
});

addBtn.addEventListener('click', () => {
    if (slideCount >= maxSlides) return;
    swiper.appendSlide(`
            <div class="swiper-slide">
                <div class="popup-content">
                    <img src="./resources/images/${slideImages[slideCount]}" alt="">
                </div>
            </div>
        `);
    slideCount++;
    updateSwiperState();
});

removeBtn.addEventListener('click', () => {
    if (slideCount <= 1) return;
    swiper.removeSlide(slideCount - 1);
    slideCount--;
    updateSwiperState();
});

resetBtn.addEventListener('click', () => {
    deleteCookie(cookieName);
    document.getElementById('chkToday').checked = false;

    while (slideCount > 1) {
        swiper.removeSlide(slideCount - 1);
        slideCount--;
    }
    updateSwiperState();

    popup.style.display = '';
});