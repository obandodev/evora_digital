<?php

$glamDocRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: '';
$glamDocRoot = rtrim(str_replace('\\', '/', $glamDocRoot), '/');

$glamProjectDir = str_replace('\\', '/', realpath(__DIR__ . '/../..'));

$glamBaseUrl = ($glamDocRoot !== '' && stripos($glamProjectDir, $glamDocRoot) === 0)
    ? substr($glamProjectDir, strlen($glamDocRoot))
    : '';

define('GLAM_BASE_URL', $glamBaseUrl);
define('GLAM_API_URL', GLAM_BASE_URL . '/backend/api');
define('GLAM_IMAGE_URL', GLAM_BASE_URL . '/backend/uploads/products');
define('GLAM_FRONTEND_URL', GLAM_BASE_URL . '/frontend');

unset($glamDocRoot, $glamProjectDir, $glamBaseUrl);