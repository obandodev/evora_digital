<?php

require_once __DIR__ . '/../../../../backend/config/database.php';
require_once __DIR__ . '/../../../../backend/modules/auth/services/AuthSetupService.php';

$authSetup = new AuthSetupService($pdo);

$authSetup->ensureAdminExists();