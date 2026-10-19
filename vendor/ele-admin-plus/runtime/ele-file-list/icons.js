import { markRaw } from "vue";
import * as iconComponents from "./components/icons/index";
const localSmallIcons = [
  {
    iconName: "FileMiscFilled",
    icon: "/ele-file-list/ic_file_misc_sm.png",
    type: "file"
  },
  {
    iconName: "FileFolderFilled",
    icon: "/ele-file-list/ic_file_folder_sm.png",
    type: "dir"
  },
  {
    iconName: "FileCodeFilled",
    icon: "/ele-file-list/ic_file_code_sm.png",
    suffixes: [
      ".java",
      ".js",
      ".css",
      ".vue",
      ".ts",
      ".tsx",
      ".scss",
      ".less",
      ".c",
      ".cpp",
      ".cs",
      ".jsp",
      ".php",
      ".asp",
      ".py",
      ".go",
      ".kt",
      ".lua"
    ]
  },
  {
    iconName: "FileHtmFilled",
    icon: "/ele-file-list/ic_file_htm_sm.png",
    suffixes: [".html", ".htm"]
  },
  {
    iconName: "FileTextFilled",
    icon: "/ele-file-list/ic_file_text_sm.png",
    suffixes: [".txt"]
  },
  {
    iconName: "FilePdfFilled",
    icon: "/ele-file-list/ic_file_pdf_sm.png",
    suffixes: [".pdf"]
  },
  {
    iconName: "FileWordFilled",
    icon: "/ele-file-list/ic_file_word_sm.png",
    suffixes: [".doc", ".docx"]
  },
  {
    iconName: "FileExcelFilled",
    icon: "/ele-file-list/ic_file_excel_sm.png",
    suffixes: [".xls", ".xlsx"]
  },
  {
    iconName: "FilePptFilled",
    icon: "/ele-file-list/ic_file_ppt_sm.png",
    suffixes: [".ppt", ".pptx"]
  },
  {
    iconName: "FileVisioFilled",
    icon: "/ele-file-list/ic_file_visio_sm.png",
    suffixes: [".vsd"]
  },
  {
    iconName: "FilePsFilled",
    icon: "/ele-file-list/ic_file_ps_sm.png",
    suffixes: [".psd"]
  },
  {
    iconName: "FileCadFilled",
    icon: "/ele-file-list/ic_file_cad_sm.png",
    suffixes: [".dwg"]
  },
  {
    iconName: "FileFlashFilled",
    icon: "/ele-file-list/ic_file_flash_sm.png",
    suffixes: [".swf"]
  },
  {
    iconName: "FileMusicFilled",
    icon: "/ele-file-list/ic_file_music_sm.png",
    suffixes: [".mp3", ".wav"]
  },
  {
    iconName: "FileVideoFilled",
    icon: "/ele-file-list/ic_file_video_sm.png",
    suffixes: [".mp4", ".rmvb", ".flv", ".avi", ".3gp"]
  },
  {
    iconName: "FilePictureFilled",
    icon: "/ele-file-list/ic_file_picture_sm.png",
    suffixes: [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".bmp",
      ".svg",
      ".webp",
      ".avif",
      ".tiff",
      ".ico"
    ]
  },
  {
    iconName: "FileFontsFilled",
    icon: "/ele-file-list/ic_file_fonts_sm.png",
    suffixes: [".ttf", ".woff"]
  },
  {
    iconName: "FileBtFilled",
    icon: "/ele-file-list/ic_file_bt_sm.png",
    suffixes: [".torrent"]
  },
  {
    iconName: "FileAndroidFilled",
    icon: "/ele-file-list/ic_file_android_sm.png",
    suffixes: [".apk"]
  },
  {
    iconName: "FileExeFilled",
    icon: "/ele-file-list/ic_file_exe_sm.png",
    suffixes: [".exe"]
  },
  {
    iconName: "FileIpaFilled",
    icon: "/ele-file-list/ic_file_ipa_sm.png",
    suffixes: [".ipa", ".dmg"]
  },
  {
    iconName: "FileZipFilled",
    icon: "/ele-file-list/ic_file_zip_sm.png",
    suffixes: [".zip", ".rar", ".7z"]
  }
];
const localIcons = localSmallIcons.map((d) => {
  return { ...d, icon: d.icon.replace("_sm.png", ".png") };
});
const smallIcons = localSmallIcons.map((d) => {
  return {
    ...d,
    icon: d.icon.replace(
      "/ele-file-list/",
      "https://cdn.eleadmin.com/20200609/"
    )
  };
});
const icons = smallIcons.map((d) => {
  return { ...d, icon: d.icon.replace("_sm.png", ".png") };
});
const svgIcons = localSmallIcons.map((d) => {
  const t = { ...d };
  if (t.iconName) {
    const ic = iconComponents[t.iconName];
    if (ic) {
      t.icon = markRaw(ic);
    }
  }
  return t;
});
export {
  icons,
  localIcons,
  localSmallIcons,
  smallIcons,
  svgIcons
};
