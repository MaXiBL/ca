import API from 'api'
import Mock from 'mockjs'

export default function initMock () {
  // 获取验证码
  Mock.mock(new RegExp(API.VERIFICATION), 'get', (option: object) => {
    console.log('获取验证码', option)
    return {
      'code': '',
      'data': {
        'value': '/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a\nHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIy\nMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAaAEYDASIA\nAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA\nAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3\nODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm\np6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA\nAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx\nBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK\nU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3\nuLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2G/uv\nsWn3N3s3+RE0m3ON20E4z+FYXhvxeniC8ltTZNbukfmA+ZvBGQD2GOo/WtXXf+Re1P8A69Jf/QDX\nmWnMNEu/D+rbFSGUOJZGy2cSOjnAOeEK/wD1+a3ZcUmjv/E3iZPDkVuzWzTvMWwN+0ALjJzg+o7e\ntYUHxEub4f8AEv8ADl1dlB+98ty2wknHRDwQO+O/pmue+IE8t5rdzKnltb2pjtt6EdSGbB565Dj2\nxirXh3XNbtdChtNC0e1n8pZJbh94dm54JVWBVscAHJYDjgVlKb5rI6qVGPs+Zq79bGprXimfUtAS\na0t76wkjuhDMxcJtcKSycNuPUdQOnY8VP4XvdXkuJ7B9QjeQxR3CtcK8xCsoOByv95c5bgjgHJIw\nr7V7XXvDYvWEh1NLlVn3sSqBlcjyx0VTtHA5+UbtxAYzXGsnTbqxvNPG5v7OS2ldUABk2DuRglcx\nk49Me1c8p2qc19DnqR5ZNWsV9R1fVpJXvF1WYwyzyRx+S7xrhdvIXPAww9T1z6nsZPHGlCV0i8yU\nLgLgBTISQPl3YAAyclivTjNcFqVpLZW9hHLNv82AXCqoAVFc8dsluOSe20fw5PWSeHvDs2dK0+ZZ\n9S+bdILjc0IVhuZwDjjIG3AJz25Yb0YNK8nuY3k2+VbG1E2oanOQdR+zKqBsaeEkRc4wGkkU7yRh\nhtVcA85ypJWJ4Inms9T1DRpdrCMs+VPAZSFbHGTnj8veit2gjK6udF4kure18O35uJ4oRJbyRoZH\nC7mKHCjPUn0rhGEGp/D6xgtkmuLy3kZgLe1eXq7ZQuoIU4IbBOeBxyK9Gh02xtrqS6gsraK4kz5k\nqRKrvk5OSBk5PNWqhNy1N2lDRnk9xpNxN4U1G91DRLr7fJMZxeuqr5a5G7K7gyj7+flx0PQAippe\np3lnp8Vh/ZGpzXLoXtmhvrmJWUgkMI0bDDqcrjI98mvXp7a3ufL8+CKXynEkfmIG2OOjDPQj1qpp\nKJ5M8+1fOkuJleTHzMFlcKCe+BwPQVEovmVnqXGvZcrV0ebaL4Ov5LItKL2J3bL26wYAx90ne6An\nlum7APUZxXTTeEr3U7e1iub6eKK2j2RCby2K8AEbEUY6cHzG468njs6KFQh1MZ1JTk5PqeaeJPCs\nukwwzw393ewn90EuW3vHgM3ykADYADxgYweueIrbxXeWcSSRNAJ9xDQra7Y/LGQiA7ycKOgAUcnO\nTkn1Cqn9l6f5/n/YbXzt2/zPJXduznOcZznvWySRjK9733OE8IvqEup3l/bx2lxcyAh1nu/JJyQW\nYKqMTzjngc9+xWpa2VpP8Q9TimtYZI/ID7HjBG4iMk4Pfk8+5optCjKytY//2Q==',
        'key': 'd2035475cec24ea8a627e9cac79ce09f'
      },
      'message': '',
      'success': true
    }
  })
  // 登录系统
  Mock.mock(new RegExp(API.LOGIN), 'post', (option: object) => {
    console.log('登录系统', option)
    return {
      'success': true,
      'message': '',
      'code': '',
      'data': {
        'access_token': '09185ee9-d3fa-4294-94ee-c96e1960b3fe',
        'refresh_token': '9d1bb2c3-29e5-4547-9e2f-e28e45ad8d30',
        'scope': 'ui',
        'token_type': 'bearer',
        'expires_in': 43188
      }
    }
  })
  // 退出登录
  Mock.mock(new RegExp(API.LOGOUT), 'get', (option: object) => {
    console.log('退出登录', option)
    return {
      'success': true,
      'message': '成功退出！',
      'code': '',
      'data': {}
    }
  })
  // 获取 用户信息
  Mock.mock(new RegExp(API.USER_INFO), 'get', (option: object) => {
    console.log('获取登录用户信息')
    return {
      'success': true,
      'message': '',
      'code': '',
      'data': {
        'thermalMapShow': '1',
        'loginName': 'songzhigang',
        'userTypeName': '医生',
        'name': '宋志刚',
        'id': '5fee662b54c84bd4859c6726f222ef40',
        'userType': '2'
      }
    }
  })
  // 修改密码
  Mock.mock(new RegExp(API.MODIFY_PASSWORD), 'post', (option: object) => {
    console.log('修改密码', option)
    return {
      'success': true,
      'message': '修改密码成功',
      'code': '',
      'data': {}
    }
  })
  // 获取病理号列表
  Mock.mock(new RegExp(API.CASE_LIST), 'get', (option: object) => {
    console.log('获取病理号列表', option)
    return {
      'success': true,
      'message': '',
      'code': '',
      'data': {
        'total': 2,
        'photoList': [
          {
            'mainThread': true,
            'id': '34ae708d36db440fbc5e7f7f8d9236b6',
            'createBy': 'Statistics-Thread',
            'createDate': 1548674886000,
            'updateBy': 'ImageStatisticsCycleThread',
            'updateDate': 1553582316000,
            'delFlag': '0',
            'remarks': null,
            'medicalRecordNumber': 'B4263771',
            'aiPredict': 0,
            'slideCount': 18,
            'receivedSlideCount': 1,
            'predictSuccessCount': 1,
            'predictFailureCount': 0,
            'riskRatio': 0,
            'riskCount': 0,
            'regionId': '01c0afec26ef47c5b3064291ccd98f2a',
            'progress': 5,
            'priority': 0,
            'hospitalId': '',
            'scanningDate': 1548664622000,
            'uploadStartDate': 1548664622000,
            'uploadFinishDate': 1548664622000,
            'predictStartDate': 1548731536000,
            'predictFinishDate': 1548731536000,
            'degree': 0,
            'diseaseIds': '',
            'review': 1,
            'reviewUserId': '1',
            'reviewDate': 1567353601000,
            'scanningFinishDate': null,
            'diseaseNames': null,
            'waitNumber': null,
            'medicalNumberStart': null,
            'medicalNumberEnd': null,
            'rgb': '#ffffff',
            'reviewUserName': '系统管理员',
            'reviewName': '已审阅',
            'newRecord': false
          },
          {
            'mainThread': true,
            'id': '3c69eec5172a479bac5faa3cb5abe8bd',
            'createBy': 'Thread-4',
            'createDate': 1548585891000,
            'updateBy': 'ImageStatisticsCycleThread',
            'updateDate': 1548585901000,
            'delFlag': '0',
            'remarks': null,
            'medicalRecordNumber': 'B1059013',
            'aiPredict': 1,
            'slideCount': 9,
            'receivedSlideCount': 9,
            'predictSuccessCount': 9,
            'predictFailureCount': 0,
            'riskRatio': 100,
            'riskCount': 9,
            'regionId': '01c0afec26ef47c5b3064291ccd98f2a',
            'progress': 100,
            'priority': 0,
            'hospitalId': '',
            'scanningDate': 1548664622000,
            'uploadStartDate': 1548411302000,
            'uploadFinishDate': 1548411302000,
            'predictStartDate': 1548411675000,
            'predictFinishDate': 1548413265000,
            'degree': 2,
            'diseaseIds': '700c02831d3f470993209b644dfe32f1',
            'review': 1,
            'reviewUserId': '1',
            'reviewDate': 1567353600000,
            'scanningFinishDate': null,
            'diseaseNames': null,
            'waitNumber': null,
            'medicalNumberStart': null,
            'medicalNumberEnd': null,
            'rgb': '#ffffff',
            'reviewUserName': '系统管理员',
            'reviewName': '已审阅',
            'newRecord': false
          }
        ]
      }
    }
  })
  // 获取切片号列表
  Mock.mock(new RegExp(API.SLIDE_LIST), 'get', (option: object) => {
    console.log('获取切片号列表', option)
    return {
      'success': true,
      'message': '',
      'code': '',
      'data': {
        'total': 2,
        'list': [{
          'id': 1175015431375818752,
          'createBy': 'org.springframework.kafka.KafkaListenerEndpointContainer#3-0-C-1',
          'createDate': 1568980484000,
          'updateBy': 'RePredictThread',
          'updateDate': 1569135199000,
          'delFlag': '0',
          'remarks': null,
          'name': '',
          'medicalRecordNumber': '1418985',
          'slideNumber': '1418985-A1',
          'slideCount': 2,
          'organId': 3,
          'path': '/data3/2019-09-20/1418985-A1/1452689-A4 - 2019-07-17 17.56.21.ndpi',
          'knifeMarkNumber': '0',
          'knifeMarkCount': 3,
          'hospitalId': 0,
          'userId': 1,
          'labelStatus': 2,
          'scanningDate': 1563357381000,
          'uploadStartDate': 1568980380000,
          'uploadFinishDate': 1568980484000,
          'predictSlideStartDate': 1569135199000,
          'predictSlideFinishDate': null,
          'dividePaths': '',
          'jobIdDivide': 1175015432155959296,
          'jobIdSlide': 84845696,
          'aiPredictDivide': 2,
          'aiPredictSlide': 4,
          'aiPredictRecover': 4,
          'rotationAngle': 0.05,
          'progress': 100,
          'updateEndDate': null,
          'scanningFinishDate': null,
          'diseaseName': null,
          'labelStatusName': '已提交',
          'mainThread': true,
          'groupName': 'A1',
          'groupId': 560769,
          'mirroredVerticality': false,
          'mirroredHorizon': false,
          'adjusted': false,
          'coordsNormalized': '[]',
          'newRecord': true
        }, {
          'id': 1175015464074612736,
          'createBy': 'org.springframework.kafka.KafkaListenerEndpointContainer#3-0-C-1',
          'createDate': 1568980492000,
          'updateBy': 'RePredictThread',
          'updateDate': 1569135199000,
          'delFlag': '0',
          'remarks': null,
          'name': '',
          'medicalRecordNumber': '1418985',
          'slideNumber': '1418985-A2',
          'slideCount': 2,
          'organId': 3,
          'path': '/data1/2019-09-20/1418985-A2/1452689-A5 - 2019-07-17 18.00.08.ndpi',
          'knifeMarkNumber': '0',
          'knifeMarkCount': 3,
          'hospitalId': 0,
          'userId': 1,
          'labelStatus': 2,
          'scanningDate': 1563357608000,
          'uploadStartDate': 1568980380000,
          'uploadFinishDate': 1568980492000,
          'predictSlideStartDate': 1569135199000,
          'predictSlideFinishDate': null,
          'dividePaths': '',
          'jobIdDivide': 1175015465047691264,
          'jobIdSlide': 80741768,
          'aiPredictDivide': 2,
          'aiPredictSlide': 4,
          'aiPredictRecover': 4,
          'rotationAngle': -7.67891,
          'progress': 100,
          'updateEndDate': null,
          'scanningFinishDate': null,
          'diseaseName': null,
          'labelStatusName': '已提交',
          'mainThread': true,
          'groupName': 'A2',
          'groupId': 896390,
          'mirroredVerticality': false,
          'mirroredHorizon': false,
          'adjusted': true,
          'coordsNormalized': '[0.3482591444429158, 0.5875386650768722]',
          'newRecord': true
        }]
      }
    }
  })
  // 获取器官列表
  Mock.mock(new RegExp(API.ORGAN_LIST), 'get', (option: object) => {
    console.log('获取器官列表', option)
    return {
      'success': true,
      'message': '',
      'code': '',
      'data': {
        'organList': [
          {
            'code': 'ST',
            'anchor': 7,
            'name': '胃部',
            'available': true,
            'pid': 0,
            'id': 3,
            'sort': 1,
            'rgb': '#555555',
            'category': 'organ',
            'type': 'stomach'
          },
          {
            'code': 'CH',
            'anchor': 7,
            'name': '肠部',
            'available': true,
            'pid': 0,
            'id': 4,
            'sort': 2,
            'rgb': '#555555',
            'category': 'organ',
            'type': 'intestines'
          },
          {
            'code': 'ES',
            'anchor': 7,
            'name': '食管',
            'available': true,
            'pid': 0,
            'id': 5,
            'sort': 2,
            'rgb': '#555555',
            'category': 'organ',
            'type': 'esophagus'
          }
        ]
      }
    }
  })
  // 获取标签列表
  Mock.mock(new RegExp(API.LABEL_LIST), 'get', (option: object) => {
    console.log('获取标签列表', option)
    return {
      'success': true,
      'message': '',
      'code': '',
      'data': {
        'organList': [
          {
            'parentId': 3111,
            'parentIds': '0,3,31,311,3111,',
            'rgb': '#FF0000',
            'aiValue': 0,
            'category': 'disease',
            'code': 'cancer',
            'sort': 2,
            'anchor': 7,
            'degree': 0,
            'available': 1,
            'childs': null,
            'diseaseIds': null,
            'keyOneFlag': null,
            'keyTwoFlag': null,
            'organType': 'stomach',
            'isRecovery': null,
            'isDefault': null,
            'name': '分化癌',
            'remarks': 'cancer',
            'delFlag': '0',
            'createBy': '1',
            'createDate': 1570523342000,
            'updateBy': '1',
            'updateDate': 1570523347000,
            'id': 31111
          },
          {
            'parentId': 3111,
            'parentIds': '0,3,31,311,3111,',
            'rgb': '#FF8C00',
            'aiValue': -1,
            'category': 'disease_copy',
            'code': '-1',
            'sort': 9,
            'anchor': 7,
            'degree': 0,
            'available': 1,
            'childs': null,
            'diseaseIds': null,
            'keyOneFlag': null,
            'keyTwoFlag': null,
            'organType': 'stomach',
            'isRecovery': null,
            'isDefault': null,
            'name': '高级别上皮内瘤变',
            'remarks': '-1',
            'delFlag': '0',
            'createBy': '1',
            'createDate': 1521251618000,
            'updateBy': '1',
            'updateDate': 1528784777000,
            'id': 31112
          },
          {
            'parentId': 3111,
            'parentIds': '0,3,31,311,3111,',
            'rgb': '#9400D3',
            'aiValue': 2,
            'category': 'disease_copy',
            'code': '2',
            'sort': 5,
            'anchor': 7,
            'degree': 0,
            'available': 1,
            'childs': null,
            'diseaseIds': null,
            'keyOneFlag': null,
            'keyTwoFlag': null,
            'organType': 'stomach',
            'isRecovery': null,
            'isDefault': null,
            'name': '低级别上皮内瘤变',
            'remarks': '2',
            'delFlag': '0',
            'createBy': '2',
            'createDate': 1520419525000,
            'updateBy': '1',
            'updateDate': 1528785091000,
            'id': 31113
          },
          {
            'parentId': 3111,
            'parentIds': '0,3,31,311,3111,',
            'rgb': '#FFC125',
            'aiValue': 0,
            'category': 'disease',
            'code': '3',
            'sort': 1,
            'anchor': 7,
            'degree': 0,
            'available': 1,
            'childs': null,
            'diseaseIds': null,
            'keyOneFlag': null,
            'keyTwoFlag': null,
            'organType': 'stomach',
            'isRecovery': null,
            'isDefault': null,
            'name': '低分化',
            'remarks': '1',
            'delFlag': '0',
            'createBy': '1',
            'createDate': 1570523342000,
            'updateBy': '1',
            'updateDate': 1570523347000,
            'id': 31114
          },
          {
            'parentId': 3111,
            'parentIds': '0,3,31,311,3111,',
            'rgb': '#FFB6C1',
            'aiValue': 0,
            'category': 'disease',
            'code': '-1',
            'sort': 3,
            'anchor': 7,
            'degree': 0,
            'available': 1,
            'childs': null,
            'diseaseIds': null,
            'keyOneFlag': null,
            'keyTwoFlag': null,
            'organType': 'stomach',
            'isRecovery': null,
            'isDefault': null,
            'name': '高级别异形增生',
            'remarks': '-1',
            'delFlag': '0',
            'createBy': '1',
            'createDate': 1570523342000,
            'updateBy': '1',
            'updateDate': 1570523347000,
            'id': 31116
          },
          {
            'parentId': 3111,
            'parentIds': '0,3,31,311,3111,',
            'rgb': '#800080',
            'aiValue': 0,
            'category': 'disease',
            'code': '2',
            'sort': 4,
            'anchor': 7,
            'degree': 0,
            'available': 1,
            'childs': null,
            'diseaseIds': null,
            'keyOneFlag': null,
            'keyTwoFlag': null,
            'organType': 'stomach',
            'isRecovery': null,
            'isDefault': null,
            'name': '低级别异性增生',
            'remarks': '2',
            'delFlag': '0',
            'createBy': '1',
            'createDate': 1570523342000,
            'updateBy': '1',
            'updateDate': 1570523347000,
            'id': 31117
          },
          {
            'parentId': 3111,
            'parentIds': '0,3,31,311,3111,',
            'rgb': '#7CFC00',
            'aiValue': 0,
            'category': 'disease',
            'code': '0',
            'sort': 5,
            'anchor': 7,
            'degree': 0,
            'available': 1,
            'childs': null,
            'diseaseIds': null,
            'keyOneFlag': null,
            'keyTwoFlag': null,
            'organType': 'stomach',
            'isRecovery': null,
            'isDefault': null,
            'name': '非肿瘤',
            'remarks': '0',
            'delFlag': '0',
            'createBy': '1',
            'createDate': 1521092553000,
            'updateBy': '1',
            'updateDate': 1528784900000,
            'id': 31118
          },
          {
            'parentId': 3111,
            'parentIds': '0,3,31,311,3111,',
            'rgb': '#FF0000',
            'aiValue': 1,
            'category': 'disease_copy',
            'code': 'cancer',
            'sort': 6,
            'anchor': 7,
            'degree': 0,
            'available': 1,
            'childs': null,
            'diseaseIds': null,
            'keyOneFlag': null,
            'keyTwoFlag': null,
            'organType': 'stomach',
            'isRecovery': null,
            'isDefault': null,
            'name': '癌',
            'remarks': '1',
            'delFlag': '0',
            'createBy': '1',
            'createDate': 1521026952000,
            'updateBy': '1',
            'updateDate': 1528784856000,
            'id': 31119
          },
          {
            'parentId': 3111,
            'parentIds': '0,3,31,311,3111,',
            'rgb': '#555555',
            'aiValue': 0,
            'category': 'disease',
            'code': 'ST_396329',
            'sort': 10,
            'anchor': 0,
            'degree': 0,
            'available': 1,
            'childs': null,
            'diseaseIds': null,
            'keyOneFlag': null,
            'keyTwoFlag': null,
            'organType': 'stomach',
            'isRecovery': 1,
            'isDefault': 1,
            'name': '第一个病例',
            'remarks': null,
            'delFlag': '0',
            'createBy': '6',
            'createDate': 1573205371000,
            'updateBy': '6',
            'updateDate': 1573205371000,
            'id': 31120
          }
        ]
      }
    }
  })
  // 获取切片预览图(报告)
  Mock.mock(new RegExp(API.SLIDE_PREVIEW_IMAGE), 'get', (option: object) => {
    console.log('获取切片预览图(报告)', option)
    return {
      'success': true,
      'message': '提交成功',
      'code': '',
      'data': {
        'paths': [
          {
            'path': '/data1/data/slide_diagram/19-2505-1-0.jpg',
            'slideNumber': '19-2505-1',
            'index': 1,
            'isCancel': 0
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-1-1.jpg',
            'slideNumber': '19-2505-1',
            'index': 2,
            'isCancel': 0
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-2-0.jpg',
            'slideNumber': '19-2505-2',
            'index': 3,
            'isCancel': 0
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-2-1.jpg',
            'slideNumber': '19-2505-2',
            'index': 4,
            'isCancel': 0
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-4-0.jpg',
            'slideNumber': '19-2505-4',
            'index': 7,
            'isCancel': 0
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-4-1.jpg',
            'slideNumber': '19-2505-4',
            'index': 8,
            'isCancel': 0
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-3-0.jpg',
            'slideNumber': '19-2505-3',
            'index': 5,
            'isCancel': 0
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-3-1.jpg',
            'slideNumber': '19-2505-3',
            'index': 6,
            'isCancel': 0
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-5-0.jpg',
            'slideNumber': '19-2505-5',
            'index': 9,
            'isCancel': 0
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-5-1.jpg',
            'slideNumber': '19-2505-5',
            'index': 10,
            'isCancel': 1
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-6-0.jpg',
            'slideNumber': '19-2505-6',
            'index': 11,
            'isCancel': 1
          },
          {
            'path': '/data1/data/slide_diagram/19-2505-6-1.jpg',
            'slideNumber': '19-2505-6',
            'index': 12,
            'isCancel': 1
          }
        ]
      }
    }
  })
}
