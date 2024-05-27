document.addEventListener('DOMContentLoaded', () => {


    const handleResize = () => {
        window.isMobile = window.innerWidth < 500;
    };


    window.addEventListener('resize', handleResize);
    handleResize();

});
