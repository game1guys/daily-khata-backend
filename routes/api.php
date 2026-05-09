<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\PartyController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'index']);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'google']);
Route::post('/auth/forgot-password/send-otp', [AuthController::class, 'sendForgotPasswordOtp']);
Route::post('/auth/forgot-password/reset', [AuthController::class, 'resetPasswordWithOtp']);

Route::middleware('supabase.auth')->group(function () {
    Route::get('/profile/me', [ProfileController::class, 'me']);
    Route::put('/profile/me', [ProfileController::class, 'update']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories/custom', [CategoryController::class, 'createCustom']);
    Route::put('/categories/{id}/budget', [CategoryController::class, 'updateBudget']);
    Route::post('/categories/{id}/budget', [CategoryController::class, 'updateBudget']);
    Route::post('/categories/set-monthly-budget', [CategoryController::class, 'setMonthlyBudget']);
    Route::post('/categories/update-budget', [CategoryController::class, 'setMonthlyBudget']);
    Route::put('/categories/update-budget', [CategoryController::class, 'setMonthlyBudget']);
    Route::post('/categories/update', [CategoryController::class, 'setMonthlyBudget']);

    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/summary', [TransactionController::class, 'summary']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);

    Route::get('/parties', [PartyController::class, 'index']);
    Route::post('/parties', [PartyController::class, 'store']);
    Route::put('/parties/{id}', [PartyController::class, 'update']);
    Route::delete('/parties/{id}', [PartyController::class, 'destroy']);
    Route::post('/parties/udhar-transaction', [PartyController::class, 'addUdhar']);
    Route::post('/parties/trigger-reminder', [PartyController::class, 'triggerReminder']);

    Route::get('/analytics/monthly-bar', [AnalyticsController::class, 'monthlyBar']);
    Route::get('/analytics/weekly-trend', [AnalyticsController::class, 'weeklyTrend']);
    Route::get('/analytics/compare-days', [AnalyticsController::class, 'compareDays']);
    Route::get('/analytics/category-chart', [AnalyticsController::class, 'categoryChart']);
    Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);
    Route::get('/analytics/ledger-lines', [AnalyticsController::class, 'ledgerLines']);

    Route::post('/subscription/preview', [SubscriptionController::class, 'preview']);
    Route::post('/subscription/create-order', [SubscriptionController::class, 'createOrder']);
    Route::post('/subscription/verify-payment', [SubscriptionController::class, 'verifyPayment']);

    Route::get('/todos', [TodoController::class, 'index']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);
    Route::patch('/todos/{id}/status', [TodoController::class, 'updateStatus']);
});

Route::post('/admin/users', [AdminController::class, 'createUser']);
Route::get('/admin/promo-codes', [AdminController::class, 'listPromoCodes']);
Route::post('/admin/promo-codes', [AdminController::class, 'createPromoCode']);
Route::patch('/admin/promo-codes/{id}', [AdminController::class, 'updatePromoCode']);
Route::get('/admin/pulse-leaders', [AdminController::class, 'pulseLeaders']);
Route::get('/admin/core-data', [AdminController::class, 'coreData']);
Route::get('/admin/ledger/{targetUserId}', [AdminController::class, 'userLedger']);
Route::get('/admin/users-paginated', [AdminController::class, 'usersPaginated']);
Route::get('/admin/notifications-paginated', [AdminController::class, 'notificationsPaginated']);
Route::post('/admin/notifications/broadcast', [AdminController::class, 'broadcastNotification']);
