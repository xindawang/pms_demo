## 说明:

### 推送接口设置：
在application.properties文件中
```yaml
notify-api.category = http://example.com
```
注：category 是该计划来源号对应的数据库中的category字段存储的值, 
#### 请求方法 

HTTP PUT

#### 请求实例
http body内容为json格式

```json
{
	"scheduleId": 1;//计划号
	"sourceId": 3；//来源号，若是履约计划则是合同号
	"category": "test";//来源号对应的类别
	"tasks": [
		{
			"taskName": "name1", //任务名
			"isFinished": true, //任务是否完成
		},
		{
			"taskName": "name2",
			"isFinished": true,
		},
		{
			"taskName": "name1",
			"isFinished": false, 
		}
		....
	]
}
```

### 查询接口:

```
GET /domain.com/projmgt/schedules/{schedule_id}/progressInfo
```

#### 请求方法 

HTTP  GET

其中schedule_id 计划id。

#### 响应实例 
与 推送接口的body 格式一致:
```json
{
	"scheduleId": 1;//计划号
	"sourceId": 3；//来源号，若是履约计划则是合同号
	"category": "test";//来源号对应的类别
	"tasks": [
		{
			"taskName": "name1", //任务名
			"isFinished": true, //任务是否完成
		},
		{
			"taskName": "name2",
			"isFinished": true,
		},
		{
			"taskName": "name1",
			"isFinished": false, 
		}
		....
	]
}
```
