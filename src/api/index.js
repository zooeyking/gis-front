import axios from 'axios';
import qs from 'qs';

//请求地址
const ip = "http://192.168.1.15:8089";
//const ip = "http://10.15.21.68:8098";
//const ip = "http://192.168.1.70:8099";

const url = ip + "/gis-service/sys";

//公共请求参数
const CommonParams = {
  ssoUserId : null,
  ssoAppKey : null,
  ssoTimestamp : null,
  ssoNonce : null,
  ssoSinatrue : null,
  pageSize : 500
};

const unitCall = function(_url, _params={}) {

  //将实际传入请求参数与公共参数合并
  let finalParams = Object.assign({}, CommonParams, _params);

  const option = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(finalParams),
    url: _url
  };
  
  return new Promise((resolve, reject)=>{
    axios(option).then((res)=>{

      resolve(res.data);

    }).catch((err)=>{
      console.log(err);
      reject(err);
    })
  })
}

//当前登录人权限
const userPowerUrl = url + '/getUserOperateBySacKeyServiceJson';

//校区列表
const zoneListUrl = url + '/campus/queryListByWhere';

//建筑类别列表
const buildingTypeListUrl = url + '/archite_category/queryListByWhere';

//建筑实体列表
const buildingListUrl = url + '/archite_entity/queryListByWhere';

//获取建筑拥有的图片
const buildingImgsUrl = url + '/archite_entity/queryImgListByWhere';

//获取服务分类清单
const serviceTypeListUrl = url + '/service_category/queryListByWhere';

//获取服务信息清单
const informationListUrl = url + '/service_info/queryListByWhere';

//获取引导清单
const guideListUrl = url + '/guide/relations';

//获取引导详情清单
const guideInfoListUrl = url + '/guide_detail/relations';

//获取活动清单
const partyListUrl = url + '/guide/queryGuideByCampusId';

//机构类别清单
const organizationListUrl = url + '/organization/queryListByWhere';

//获取机构清单
const agencyListUrl = url + '/org_entity/queryListByWhere';

//获取动态提示数据
const TipListUrl = url + '/search';


export {
  ip,
  
  unitCall,

  zoneListUrl,
  
  buildingTypeListUrl,
  
  buildingListUrl,
  
  organizationListUrl,
  
  relationCampusUrl,
  
  agencyListUrl,
  
  serviceTypeListUrl,
  
  informationListUrl,
  
  guideListUrl,

  guideInfoListUrl,
  
  partyListUrl,

  sortServiceInfoUrl,

  buildingImgsUrl,

  TipListUrl
}