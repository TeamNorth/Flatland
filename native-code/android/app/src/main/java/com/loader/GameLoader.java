package com.loader;

import android.content.Context;
import android.support.annotation.Nullable;
import android.util.Log;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Dictionary;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;

/**
 * Created by James on 2016-11-17.
 */

public class GameLoader {

    public static final String SHARED_PREFERENCES = "GameLoader_Preferences";

    private Context context;
    private File bundleDirectory;
    private HashMap<String, String> bundlePaths = new HashMap<>();

    public GameLoader(Context context) {
        this.context = context;

        this.bundleDirectory = context.getDir("bundles", Context.MODE_PRIVATE);
        if(!this.bundleDirectory.exists())
            this.bundleDirectory.mkdirs();

        //read available bundles
        File[] bundles = this.bundleDirectory.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String filename) {
                return filename.endsWith(".jsbundle");
            }
        });

        for (File f : bundles) {
            Log.d("BundleName", f.getName());
            bundlePaths.put(f.getName().replace(".jsbundle", ""), f.getAbsolutePath());
        }
    }

    public void writeBundle(String name, String sBundle) {
        File bundleFile = new File(this.bundleDirectory, name + ".jsbundle");

        try {
            FileUtils.writeStringToFile(bundleFile, sBundle, Charset.defaultCharset());
        }
        catch (IOException e) {
            e.printStackTrace();
        }

        bundlePaths.put(name, bundleFile.getAbsolutePath());
    }

    public @Nullable String getBundlePath(String bundleName) {
        return bundlePaths.containsKey(bundleName) ? bundlePaths.get(bundleName) : null;
    }
}
