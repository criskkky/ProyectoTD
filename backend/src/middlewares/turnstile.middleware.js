"use strict";
import { TURNSTILE_SECRET_KEY } from "../config/configEnv.js";
import { handleErrorClient } from "../handlers/responseHandlers.js";

/**
 * Middleware para verificar el token de Cloudflare Turnstile
 * @param {Object} req - Request object
 * @param {Object} res - Response object  
 * @param {Function} next - Next middleware function
 */
export async function verifyTurnstile(req, res, next) {
  try {
    const { turnstileToken } = req.body;

    // Verificar que el token esté presente
    if (!turnstileToken) {
      return handleErrorClient(
        res,
        400,
        "Error de verificación",
        "Token de verificación de captcha requerido"
      );
    }

    // Preparar los datos para la verificación
    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', turnstileToken);
    formData.append('remoteip', req.ip || req.connection.remoteAddress);

    // Verificar el token con Cloudflare
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const verificationResult = await verificationResponse.json();

    // Verificar la respuesta de Cloudflare
    if (!verificationResult.success) {
      const errorCodes = verificationResult['error-codes'] || [];
      let errorMessage = "Verificación de captcha fallida";
      
      // Personalizar mensaje según el tipo de error
      if (errorCodes.includes('timeout-or-duplicate')) {
        errorMessage = "El captcha ha expirado o ya fue utilizado. Por favor, inténtalo de nuevo.";
      } else if (errorCodes.includes('invalid-input-response')) {
        errorMessage = "Token de captcha inválido. Por favor, inténtalo de nuevo.";
      } else if (errorCodes.includes('invalid-input-secret')) {
        errorMessage = "Error de configuración del servidor. Contacta al administrador.";
      }

      return handleErrorClient(
        res,
        400,
        "Error de verificación de captcha",
        errorMessage
      );
    }

    // Si llegamos aquí, la verificación fue exitosa
    // Remover el token del body para que no interfiera con otras validaciones
    delete req.body.turnstileToken;
    
    next();
  } catch (error) {
    console.error('Error verificando Turnstile:', error);
    return handleErrorClient(
      res,
      500,
      "Error interno del servidor",
      "Error al verificar el captcha. Por favor, inténtalo de nuevo."
    );
  }
}

/**
 * Middleware opcional para verificar Turnstile (no obligatorio)
 * Útil para endpoints donde el captcha es opcional
 */
export async function verifyTurnstileOptional(req, res, next) {
  try {
    const { turnstileToken } = req.body;

    // Si no hay token, continuar sin verificar
    if (!turnstileToken) {
      return next();
    }

    // Si hay token, verificarlo
    await verifyTurnstile(req, res, next);
  } catch (error) {
    // En caso de error, loguear pero continuar
    console.error('Error en verificación opcional de Turnstile:', error);
    next();
  }
}
