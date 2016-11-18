package com.loader;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.Toast;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

/**
 * Created by James on 2016-11-17.
 */

public class GameLoaderModule extends ReactContextBaseJavaModule {

    private GameLoader mGameLoader;
    private final Context ctx;

    public GameLoaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mGameLoader = new GameLoader(reactContext);
        ctx = reactContext;
    }

    @ReactMethod
    public void downloadBundle(String name, String bundle) {
        Log.d("BundleDownload", "Received");
        Toast.makeText(ctx, "Called GameLoader", Toast.LENGTH_LONG).show();

        if (bundle != "error")
            mGameLoader.writeBundle(name, bundle);
    }

    @ReactMethod
    public void bootGame(final String name) {
        SharedPreferences prefs = ctx.getSharedPreferences(GameLoader.SHARED_PREFERENCES, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        Log.d("BundleBoot", prefs.getString("game", "null"));
        editor.putString("game", name);
        editor.putBoolean("bootIntoGame", true);
        editor.apply();

        final Activity myActivity = getCurrentActivity();

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    Assertions.assertNotNull(myActivity).recreate();
                }
                catch (Exception e) {
                    Toast.makeText(ctx, "Unable to boot into " + name, Toast.LENGTH_LONG).show();
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    public String getName() {
        return "GameLoader";
    }
}
