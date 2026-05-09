<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'spa');

Route::view('/{any}', 'spa')->where('any', '.*');
