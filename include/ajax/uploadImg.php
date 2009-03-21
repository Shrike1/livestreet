<?php
/*-------------------------------------------------------
*
*   LiveStreet Engine Social Networking
*   Copyright © 2008 Mzhelskiy Maxim
*
*--------------------------------------------------------
*
*   Official site: www.livestreet.ru
*   Contact e-mail: rus.engine@gmail.com
*
*   GNU General Public License, version 2:
*   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
*
---------------------------------------------------------
*/

/**
 * Загрузка картинок
 */

set_include_path(get_include_path().PATH_SEPARATOR.dirname(dirname(dirname(__FILE__))));
$sDirRoot=dirname(dirname(dirname(__FILE__)));
require_once($sDirRoot."/config/config.ajax.php");

$aForm=@$_REQUEST['value'];
$bStateError=true;
$sText='';
if ($oEngine->User_IsAuthorization()) {
	$sFile=null;
	$oUserCurrent=$oEngine->User_GetUserCurrent();
	if (is_uploaded_file($_FILES['img_file']['tmp_name'])) {
		$sFileTmp=$_FILES['img_file']['tmp_name'];		
		$sDirSave=DIR_UPLOADS_IMAGES.'/'.func_generator(1).'/'.func_generator(1).'/'.func_generator(1).'/'.func_generator(1).'/'.$oUserCurrent->getId();
		if ($sFileImg=func_img_resize($sFileTmp,$sDirSave,func_generator(),3000,3000,BLOG_IMG_RESIZE_WIDTH,null,false)) {
			$sFile=$sDirSave.'/'.$sFileImg;
		}
	}

	if (isset($_REQUEST['img_url'])) {
		$img_url=$_REQUEST['img_url'];
		if (@getimagesize($img_url)) {			
			if ($file = fopen($img_url,"r")) {
				$iMaxSizeKb=500;
				$iSizeKb=0;
				$sContent='';
				while (!feof($file) and $iSizeKb<$iMaxSizeKb) {
					$sContent.=fread($file ,1024*1);
					$iSizeKb++;
				}
				/**
				 * Если файл считали польностью, т.е. он уложился в предельно допустимый размер
				 */
				if (feof($file)) {
					fclose($file);
					$sFileTmp=SYS_CACHE_DIR.func_generator();
					$fp=fopen($sFileTmp,'w');
					fwrite($fp,$sContent);
					fclose($fp);					
					$sDirSave=DIR_UPLOADS_IMAGES.'/'.func_generator(1).'/'.func_generator(1).'/'.func_generator(1).'/'.func_generator(1).'/'.$oUserCurrent->getId();
					if ($sFileImg=func_img_resize($sFileTmp,$sDirSave,func_generator(),3000,3000,BLOG_IMG_RESIZE_WIDTH,null,false)) {
						$sFile=$sDirSave.'/'.$sFileImg;
					}
					@unlink($sFileTmp);
				}
			}
		}
	}
	
	if (!is_null($sFile)) {
		$bStateError=false;
		$sText='<img src="'.DIR_WEB_ROOT.$sFile.'" ';
		if (isset($_REQUEST['title']) and $_REQUEST['title']!='') {
			$sText.=' title="'.htmlspecialchars($_REQUEST['title']).'" ';
		}
		if (isset($_REQUEST['align']) and in_array($_REQUEST['align'],array('left','right'))) {
			$sText.=' align="'.htmlspecialchars($_REQUEST['align']).'" ';
		}
		$sText.='>';
	}	
}




$GLOBALS['_RESULT'] = array(
"bStateError"     => $bStateError,
"sText"   => $sText,
);

?>
<pre>
<b>Request method:</b> <?=$_SERVER['REQUEST_METHOD'] . "\n"?>
<b>Loader used:</b> <?=$JsHttpRequest->LOADER . "\n"?>
<b>_REQUEST:</b> <?=print_r($_REQUEST, 1)?>
</pre>