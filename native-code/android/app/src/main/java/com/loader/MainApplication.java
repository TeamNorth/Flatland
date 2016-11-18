package com.loader;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        //private String loaderName = "loader.jsbundle";
        private GameLoader mGameloader = null;


        @Override
        protected @Nullable String getJSBundleFile() {

            mGameloader = new GameLoader(getApplicationContext());

            SharedPreferences prefs = getApplicationContext().getSharedPreferences(GameLoader.SHARED_PREFERENCES, Context.MODE_PRIVATE);
            Boolean bootIntoGame = prefs.getBoolean("bootIntoGame", false);
            Log.d("Boot", "Boot into game: " + bootIntoGame);
            String gameName;

            if(!bootIntoGame) {
                return mGameloader.getBundlePath("loader");
            }
            else {
                gameName = prefs.getString("game", "loader");
                Log.d("Boot", "Game: " + gameName);
                SharedPreferences.Editor editor = prefs.edit();
                editor.putBoolean("bootIntoGame", false);
                editor.apply();

                String path = mGameloader.getBundlePath(gameName);

                if (path != null)
                    Log.d("BundleBootPath", path);
                else
                    Log.d("BundleBootPath", "null");

                return path;
            }
        }

        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new GameLoaderPackage()
            );
        }
    };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
