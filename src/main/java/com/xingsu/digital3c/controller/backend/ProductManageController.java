package com.xingsu.digital3c.controller.backend;

import com.google.common.collect.Maps;
import com.xingsu.digital3c.common.Const;
import com.xingsu.digital3c.common.ResponseCode;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.pojo.Product;
import com.xingsu.digital3c.pojo.User;
import com.xingsu.digital3c.service.IFileService;
import com.xingsu.digital3c.service.IProductService;
import com.xingsu.digital3c.service.IUserService;
import com.xingsu.digital3c.util.PropertiesUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Map;

/**
 * Created by 14195 on 2018/3/21.
 */
@Controller
@RequestMapping("/manage/product/")
public class ProductManageController {

    @Autowired
    private IUserService iUserService;

    @Autowired
    private IProductService iProductService;

    @Autowired
    private IFileService iFileService;

    /**
     * 查询商品列表
     * @param session
     * @param pageNum
     * @param pageSize
     * @return
     */
    @RequestMapping(value = "list.do",method = RequestMethod.GET)
    @ResponseBody
    public Map getList(HttpSession session, @RequestParam(value="pageNum", defaultValue = "1") int pageNum,
                       @RequestParam(value="pageSize", defaultValue = "10") int pageSize) {
        User user = (User) session.getAttribute(Const.CURRENT_USER);
        Map resultMap = Maps.newHashMap();
        if (user == null) {
            resultMap.put("status", 1);
            resultMap.put("msg", "用户未登录，请登录后重试");
            return resultMap;
        }
        if (iUserService.checkAdminRole(user).isSuccess()) {
            return iProductService.getProductList(pageNum, pageSize);
        } else {
            resultMap.put("status", 1);
            resultMap.put("msg", "用户权限不足");
            return resultMap;
        }
    }

    /**
     * 获取商品详情
     * @param session
     * @param productId
     * @return
     */
    @RequestMapping(value = "detail.do", method = RequestMethod.GET)
    @ResponseBody
    public ServerResponse getDetail(HttpSession session, Integer productId) {
        User user = (User) session.getAttribute(Const.CURRENT_USER);
        if (user == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(), "用户未登录，请登录后重试");
        }
        if (iUserService.checkAdminRole(user).isSuccess()) {
            return iProductService.manageProductDetail(productId);
        } else {
            return ServerResponse.createByErrorMessage("无权限操作");
        }
    }

    @RequestMapping(value = "del.do", method = RequestMethod.DELETE)
    @ResponseBody
    public ServerResponse delProduct(HttpSession session, Integer productId){
        User user = (User) session.getAttribute(Const.CURRENT_USER);
        if(user == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(), ResponseCode.NEED_LOGIN.getDesc());
        }
        if(iUserService.checkAdminRole(user).isSuccess()){
            return iProductService.delProduct(productId);
        }else{
            return ServerResponse.createByErrorMessage("无权限操作");
        }

    }

    /**
     * ftp文件上传
     * @param file
     * @param request
     * @return
     */
    @RequestMapping("upload.do")
    @ResponseBody
    public ServerResponse upload(HttpSession session, @RequestParam(value = "file", required = false) MultipartFile file, HttpServletRequest request){
        User user = (User) session.getAttribute(Const.CURRENT_USER);
        if (user == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(), "用户未登录，请登录后重试");
        }
        if (iUserService.checkAdminRole(user).isSuccess()) {
            String path = request.getSession().getServletContext().getRealPath("upload");
            String targetFileName = iFileService.upload(file, path);
            String url = PropertiesUtil.getProperty("ftp.server.http.prefix") + targetFileName;

            Map fileMap = Maps.newHashMap();
            fileMap.put("uri", targetFileName);
            fileMap.put("url",url);

            return ServerResponse.createBySuccess(fileMap);
        } else {
            return ServerResponse.createByErrorMessage("无权限操作");
        }
    }

    @RequestMapping(value = "rich_text_img_upload.do",method = RequestMethod.POST)
    @ResponseBody
    public Map richTextImgUpload(HttpSession session, @RequestParam(value = "file", required = false) MultipartFile file, HttpServletRequest request, HttpServletResponse response){
        Map resultMap = Maps.newHashMap();
        User user = (User) session.getAttribute(Const.CURRENT_USER);
        if (user == null) {
            resultMap.put("success", false);
            resultMap.put("msg", "请登录管理员");
            return resultMap;
        }
        //富文本中对于返回值有自己的要求
        if (iUserService.checkAdminRole(user).isSuccess()) {
            String path = request.getSession().getServletContext().getRealPath("upload");
            String targetFileName = iFileService.upload(file, path);
            if(StringUtils.isBlank(targetFileName)){
                resultMap.put("code", 1);
                resultMap.put("msg", "上传失败");
                return resultMap;
            }
            String url = "../../product/getImage?imageName=" +targetFileName;

            resultMap.put("code", 0);
            resultMap.put("msg", "上传成功");
            Map data = Maps.newHashMap();
            data.put("src", url);
            data.put("title", "图片");
            resultMap.put("data", data);

            response.addHeader("Access-Control-Allow-Headers", "X-File-Name");
            return resultMap;
        } else {
            resultMap.put("code", 1);
            resultMap.put("msg", "无权限操作");
            return resultMap;
        }

    }

    /**
     * 新增，保存更新商品
     * @param session
     * @param product
     * @return
     */
    @RequestMapping("save.do")
    @ResponseBody
    public ServerResponse productSave(HttpSession session, @RequestBody Product product) {
        User user = (User) session.getAttribute(Const.CURRENT_USER);
        if (user == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(), "用户未登录，请登录后重试");
        }
        if (iUserService.checkAdminRole(user).isSuccess()) {
            //填充我们增加的产品业务逻辑
            return iProductService.saveOrUpdateProduct(product);
        } else {
            return ServerResponse.createByErrorMessage("无权限操作");
        }
    }

    /**
     * 上下架商品
     * @param session
     * @param productId
     * @param status
     * @return
     */
    @RequestMapping(value = "set_sale_status.do", method = RequestMethod.PUT)
    @ResponseBody
    public ServerResponse setSaleStatus(HttpSession session, Integer productId, Integer status) {
        User user = (User) session.getAttribute(Const.CURRENT_USER);
        if (user == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(), "用户未登录，请登录后重试");
        }
        if (iUserService.checkAdminRole(user).isSuccess()) {
            return iProductService.setSaleStatus(productId, status);
        } else {
            return ServerResponse.createByErrorMessage("无权限操作");
        }
    }
}
