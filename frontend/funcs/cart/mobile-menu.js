export function initMobileMenu(){
    const menuToggle=
        document.getElementById(
            'menu-toggle'
        );

    const mobileMenu=
        document.getElementById(
            'mobile-menu'
        );

    const mobileMenuClose=
        document.getElementById(
            'mobile-menu-close'
        );

    const overlay=
        document.getElementById(
            'mobile-menu-overlay'
        );

    function openMenu(){
        if(!mobileMenu)return;

        mobileMenu.classList.add(
            'open'
        );

        menuToggle?.classList.add(
            'active'
        );

        menuToggle?.setAttribute(
            'aria-expanded',
            'true'
        );

        mobileMenu.setAttribute(
            'aria-hidden',
            'false'
        );

        if(overlay){
            overlay.hidden=false;
        }

        document.body.classList.add(
            'mobile-menu-open'
        );
    }

    function closeMenu(){
        if(!mobileMenu)return;

        mobileMenu.classList.remove(
            'open'
        );

        menuToggle?.classList.remove(
            'active'
        );

        menuToggle?.setAttribute(
            'aria-expanded',
            'false'
        );

        mobileMenu.setAttribute(
            'aria-hidden',
            'true'
        );

        if(overlay){
            overlay.hidden=true;
        }

        document.body.classList.remove(
            'mobile-menu-open'
        );
    }

    menuToggle?.addEventListener(
        'click',
        ()=>{
            mobileMenu?.classList.contains(
                'open'
            )
                ?closeMenu()
                :openMenu();
        }
    );

    mobileMenuClose?.addEventListener(
        'click',
        closeMenu
    );

    overlay?.addEventListener(
        'click',
        closeMenu
    );

    mobileMenu
        ?.querySelectorAll('a')
        .forEach(link=>{
            link.addEventListener(
                'click',
                closeMenu
            );
        });
}
