const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorBlur.style.left = e.clientX + 'px';
    cursorBlur.style.top = e.clientY + 'px';
});

function handleCursorActivation(element, activate, state) {
    if (activate) {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            if (state) {
                cursor.classList.add(state);
            }
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            if (state) {
                cursor.classList.remove(state);
            }
        });
    }
}

const interactiveElements = document.querySelectorAll('a, button');
const projectItems = document.querySelectorAll('.developing-item'); //select the correct class

interactiveElements.forEach((element) => {
    handleCursorActivation(element, true);
});