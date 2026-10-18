<?php
require_once __DIR__ . '/../config/app.php';
?>

<footer class="site-footer">
    <div class="footer-brand">
        <strong>Glam Beauty</strong>
        <span>Belleza que habla por ti.</span>
    </div>

    <span class="footer-copy">
        © <?= date('Y') ?> Glam Beauty
    </span>
</footer>

<?php
$evora_wa_numero  = '573118254187';
$evora_wa_mensaje = "Hola, estoy interesada en un producto de E'vora Digital.";
$evora_wa_url     = 'https://wa.me/' . $evora_wa_numero . '?text=' . rawurlencode($evora_wa_mensaje);
?>
<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/styles/whatsapp-button.css">

<a class="evora-wa-button"
   href="<?= htmlspecialchars($evora_wa_url) ?>"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Escríbenos por WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.52.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.41-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
</a>

<script type="module">
    import { updateCartCount } from '<?= GLAM_FRONTEND_URL ?>/funcs/cart.js';

    updateCartCount();
</script>