    </div>
</div>

<script type="module">

import { AuthAPI } from '<?= GLAM_FRONTEND_URL ?>/api/authApi.js';

document
    .getElementById('admin-logout')
    ?.addEventListener(
        'click',
        async()=>{
            try{
                await AuthAPI.logout();
            }finally{
                window.location.href=
                    '<?= GLAM_FRONTEND_URL ?>/pages/login.php';
            }
        }
    );

const menuToggle=
    document.getElementById(
        'admin-menu-toggle'
    );

const sidebar=
    document.getElementById(
        'admin-sidebar'
    );

const overlay=
    document.getElementById(
        'admin-sidebar-overlay'
    );

function openAdminMenu(){

    sidebar?.classList.add(
        'open'
    );

    menuToggle?.classList.add(
        'active'
    );

    menuToggle?.setAttribute(
        'aria-expanded',
        'true'
    );

    if(overlay){
        overlay.hidden=false;
    }

    document.body.classList.add(
        'admin-menu-open'
    );
}

function closeAdminMenu(){

    sidebar?.classList.remove(
        'open'
    );

    menuToggle?.classList.remove(
        'active'
    );

    menuToggle?.setAttribute(
        'aria-expanded',
        'false'
    );

    if(overlay){
        overlay.hidden=true;
    }

    document.body.classList.remove(
        'admin-menu-open'
    );
}

menuToggle?.addEventListener(
    'click',
    ()=>{
        sidebar?.classList.contains(
            'open'
        )
            ?closeAdminMenu()
            :openAdminMenu();
    }
);

overlay?.addEventListener(
    'click',
    closeAdminMenu
);

sidebar
    ?.querySelectorAll(
        '.admin-nav-link,.admin-exit-link'
    )
    .forEach(
        link=>{
            link.addEventListener(
                'click',
                closeAdminMenu
            );
        }
    );

document.addEventListener(
    'keydown',
    event=>{
        if(
            event.key==='Escape'
        ){
            closeAdminMenu();
        }
    }
);

</script>

<script
    type="module"
    src="<?= GLAM_FRONTEND_URL ?>/funcs/admin.js"
></script>

</body>
</html>