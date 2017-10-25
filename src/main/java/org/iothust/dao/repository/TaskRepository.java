package org.iothust.dao.repository;

import java.util.HashMap;
import java.util.List;

import org.iothust.dao.entity.DataEntity;
import org.iothust.dao.entity.TaskEntity;
import org.iothust.dao.entity.UniversalTaskEntity;
import org.iothust.dao.mapper.DataMapper;
import org.iothust.dao.mapper.TaskMapper;
import org.iothust.dao.mapper.UniversalTaskMapper;
import org.iothust.exception.AddException;
import org.iothust.exception.DeleteException;
import org.iothust.exception.UpdateException;
import org.iothust.tools.CheckTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional(rollbackFor = Exception.class)
public class TaskRepository implements BaseRepository<TaskEntity> {
    @Autowired
    private TaskMapper tm;

    @Autowired
    private DataMapper dm;

    @Autowired
    private UniversalTaskMapper utm;

    @Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
    @Override
    public TaskEntity getById(long id) {
        // TODO 自动生成的方法存根
        return tm.getById(id);
    }

    @Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
    public List<TaskEntity> getTasksByScheduleId(long scheduleId) {
        return tm.getByScheduleId(scheduleId);
    }

    //获取计划模板的任务
    @Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
    public List<TaskEntity> getTasksByUnivScheduleId(long univScheduleId) {
        return tm.getByUnivScheduleId(univScheduleId);
    }

    @Override
    @Transactional
    public TaskEntity update(TaskEntity te) throws UpdateException {
        // TODO 自动生成的方法存根
        if (tm.updateScheduleTask(te) == 0)
            throw new UpdateException();
        if (tm.updateTask(te) == 0)
            throw new UpdateException();
        return te;
    }

    @Override
    @Transactional
    public TaskEntity add(TaskEntity te) throws AddException {
        // TODO 自动生成的方法存根
        te.setId(null);
        if (tm.addTask(te) == 0)
            throw new AddException();
        if (tm.addScheduleTask(te) == 0)
            //可能是该计划下任务已存在
            throw new AddException();
        if (!CheckTool.stringIsNull(te.getUniversalTask())) {
            UniversalTaskEntity ute = utm.getByName(te.getUniversalTask());
            if (ute == null) {
                throw new AddException("通用任务已经删除");
            }
            List<Long> dataIdList = dm.getDataIdByUTId(ute.getId());
            HashMap<Long,Long> dataIdOldToNew = new HashMap<Long,Long>();
            for (Long dl : dataIdList) {
                DataEntity de = dm.getDataById(dl);
                de.setId(null);
                if (dm.addData(de) == 0)
                    throw new AddException();
                dm.addTaskData(te.getId(), de.getId());
                dataIdOldToNew.put(dl, de.getId());
            }
          //对任务数据的父节点id进行修改
			for(Long newDataId:dataIdOldToNew.values()){
				Long oldDataParentId = dm.getParentId(newDataId);		//获取之前插入时未改变的父级id
				if (oldDataParentId!=null){
					Long newParentId = dataIdOldToNew.get(oldDataParentId);
					dm.updateParentId(newDataId,newParentId);//修改为新的父级id
				}
			}
        }
        return te;
    }

    //更新计划模板的任务
    @Transactional
    public TaskEntity updateUniScheduleTask(TaskEntity te) throws UpdateException {
        // TODO 自动生成的方法存根
        if (tm.updateUniversalScheduleTask(te) == 0)
            throw new UpdateException();
        if (tm.updateTask(te) == 0)
            throw new UpdateException();
        return te;
    }

    //为计划模板创建任务
    @Transactional
    public TaskEntity addUniScheudleTask(TaskEntity te) throws Exception {
        // TODO 自动生成的方法存根
        te.setId(null);
        if (tm.addTask(te) == 0)
            throw new AddException();
        if (tm.addUniversalScheudleTask(te) == 0)
            throw new AddException();
        UniversalTaskEntity ute = utm.getByName(te.getUniversalTask());
        if (ute == null) {
            throw new AddException("通用任务已经删除");
        }
        List<Long> dataIdList = dm.getDataIdByUTId(ute.getId());
        HashMap<Long, Long> dataIdOldToNew = new HashMap<Long, Long>();    //用于处理层级关系
        for (Long dl : dataIdList) {
            DataEntity de = dm.getDataById(dl);
            de.setId(null);
            if (dm.addData(de) == 0)
                throw new AddException();
            if (dm.addTaskData(te.getId(), de.getId()) == 0)
                throw new AddException();
            dataIdOldToNew.put(dl, de.getId());
            //对任务数据的父节点id进行修改

        }
        for (Long newDataId : dataIdOldToNew.values()) {
                Long oldDataParentId = dm.getParentId(newDataId);        //获取之前插入时未改变的父级id
                if (oldDataParentId != null) {
                    dm.updateParentId(newDataId, dataIdOldToNew.get(oldDataParentId));//修改为新的父级id
                }
            }
        return te;
    }


    @Override
    @Transactional
    public void delById(long id) throws DeleteException {
        // TODO 自动生成的方法存根
        if (tm.delScheduleTaskByTaskId(id) == 0)
            throw new DeleteException();
        tm.delTaskDataByTaskId(id);        //删除可能有的数据
        if (tm.delTaskById(id) == 0)
            throw new DeleteException();
    }

    @Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
    public List<TaskEntity> getFinishedByUserId(long userId) {
        return tm.getFinishedByUserId(userId);
    }

    @Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
    public List<TaskEntity> getUnfinishedByUserId(long userId) {
        return tm.getUnfinishedByUserId(userId);
    }

    //删除计划模板的任务及任务数据
    public void delUniScheduleTask(long id) throws DeleteException {
        // TODO 自动生成的方法存根
        if (tm.delUniScheduleTaskByTaskId(id) == 0)
            throw new DeleteException();
        tm.delTaskDataByTaskId(id);        //删除可能有的数据
        if (tm.delTaskById(id) == 0)
            throw new DeleteException();
    }

    public TaskEntity getUniScheduleTaskById(Long id) {
        // TODO Auto-generated method stub
        return tm.getUniScheduleTaskById(id);
    }


    //修改层级任务子任务的父节点及sort
    public void updateLevelTask(TaskEntity te) throws UpdateException {
        // TODO Auto-generated method stub
        tm.updateLevelTask(te);
    }

    public TaskEntity getTaskById(Long id) {
        return tm.getTaskById(id);
    }

}
