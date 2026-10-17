package com.zinistag.app

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private val REQUEST_CAMERA = 100
    private val PERMISSION_REQUEST_CODE = 101

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setupWebView()
    }

    /**
     * Native Camera Intent Trigger.
     * Launches the system video capture camera activity with request code 100.
     */
    fun openCamera() {
        val intent = Intent(MediaStore.ACTION_VIDEO_CAPTURE)

        if (intent.resolveActivity(packageManager) != null) {
            startActivityForResult(intent, REQUEST_CAMERA)
        } else {
            Toast.makeText(this, "No camera application found to record video", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Verifies runtime permissions before firing ACTION_VIDEO_CAPTURE
     */
    fun checkPermissionsAndOpenCamera() {
        val cameraGranted = ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        val audioGranted = ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED

        if (cameraGranted && audioGranted) {
            openCamera()
        } else {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(
                    Manifest.permission.CAMERA,
                    Manifest.permission.RECORD_AUDIO,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                ),
                PERMISSION_REQUEST_CODE
            )
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_CAMERA) {
            if (resultCode == Activity.RESULT_OK) {
                val videoUri: Uri? = data?.data
                if (videoUri != null) {
                    Toast.makeText(this, "Reel captured: $videoUri", Toast.LENGTH_LONG).show()
                    // Dispatch captured URI to the Web UI layer
                    webView.evaluateJavascript("window.onNativeVideoRecorded?.('$videoUri')", null)
                } else {
                    Toast.makeText(this, "Reel captured successfully", Toast.LENGTH_SHORT).show()
                }
            } else if (resultCode == Activity.RESULT_CANCELED) {
                Toast.makeText(this, "Video capture cancelled", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {
                openCamera()
            } else {
                Toast.makeText(this, "Permissions required for recording reels", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun setupWebView() {
        webView = findViewById(R.id.webView)
        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.allowFileAccess = true

        // Register Android JavaScript Bridge
        webView.addJavascriptInterface(WebAppInterface(), "Android")

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.grant(request.resources)
            }
        }

        webView.webViewClient = WebViewClient()
        webView.loadUrl("file:///android_asset/dist/index.html")
    }

    inner class WebAppInterface {
        @JavascriptInterface
        fun openCamera() {
            runOnUiThread {
                checkPermissionsAndOpenCamera()
            }
        }

        @JavascriptInterface
        fun getTargetSDK(): Int = 36
    }
}
