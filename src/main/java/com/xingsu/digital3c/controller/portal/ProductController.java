package com.xingsu.digital3c.controller.portal;

import com.github.pagehelper.PageInfo;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.service.IProductService;
import com.xingsu.digital3c.util.PropertiesUtil;
import com.xingsu.digital3c.vo.ProductListVo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.net.URLEncoder;
import java.util.List;

@Controller
@RequestMapping("/product/")
public class ProductController {

    private final static Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private IProductService iProductService;


    /**
     * 根据商品分类查询列表
     * @param categoryId
     * @return
     */
    @RequestMapping(value = "listByCategoryId", method = RequestMethod.GET)
    @ResponseBody
    public ServerResponse<List<ProductListVo>> list(@RequestParam(value = "categoryId") Integer categoryId,
                                                    @RequestParam(value = "limit", defaultValue = "4") Integer limit){
        return iProductService.getProductByCategory(categoryId, limit);
    }

    /**
     * 根据图片名称获取对应的商品图片
     */
    @RequestMapping(value = "getImage", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Resource> getImage(@RequestParam(value = "mainImageName") String mainImageName) {
        String filePath = PropertiesUtil.getProperty("ftp.imageDir");
        String filename = mainImageName;
        try {
            FileInputStream fs = new FileInputStream(filePath + "/" + filename);
            HttpHeaders headers = new HttpHeaders();
            //设置下载文件名
            filename = URLEncoder.encode(filename, "UTF-8");
            headers.add("Content-Disposition", "attachment;filename=\"" + filename + "\"");

            Resource resource = new InputStreamResource(fs);

            return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType("image/jpeg")).body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            logger.error("PictureController.find error, ", e);
        }
        return null;
    }
}
