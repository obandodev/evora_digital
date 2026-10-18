import { showModalMessage } from './modal.js';

export function previewImage(event) {
    const file =
        event.target.files?.[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith('image/')) {
        showModalMessage(
            'Selecciona un archivo de imagen válido.'
        );

        event.target.value = '';

        return;
    }

    const reader =
        new FileReader();

    reader.onload = readerEvent => {
        showPreview(readerEvent.target.result);
    };

    reader.readAsDataURL(file);
}

export function showPreview(src) {
    const container =
        document.getElementById('product-image-preview');

    const image =
        document.getElementById('product-preview-image');

    if (!container || !image) {
        return;
    }

    image.src = src;
    container.hidden = false;
}

export function removePreview() {
    const container =
        document.getElementById('product-image-preview');

    const image =
        document.getElementById('product-preview-image');

    const input =
        document.getElementById('product-image');

    if (container) {
        container.hidden = true;
    }

    if (image) {
        image.src = '';
    }

    if (input) {
        input.value = '';
    }
}

export function getProductImage(product) {
    let image = '';

    if (product.image_url) {
        image = product.image_url;
    } else if (product.image) {
        image = product.image;
    } else if (product.main_image) {
        image = product.main_image;
    } else if (
        Array.isArray(product.images) &&
        product.images.length
    ) {
        const item = product.images[0];

        image = typeof item === 'string'
            ? item
            : item.url ||
              item.image_url ||
              item.path ||
              '';
    }

    if (!image) {
        return '';
    }

    if (
        image.startsWith('http://') ||
        image.startsWith('https://') ||
        image.startsWith('data:') ||
        image.startsWith('/')
    ) {
        return image;
    }

    sreturn `${window.GLAM.IMAGE_URL}/${image.split('/').pop()}`;
}
