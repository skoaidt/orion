import express from "express";
import {
  initColumns,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  updateTasksOrder,
} from "../controllers/kanban.js";

const router = express.Router();

// 칸반 컬럼 초기화
router.post("/:ideaId/init", initColumns);

// 작업 관련 라우트
router.get("/:ideaId/tasks", getTasks);
router.post("/:ideaId/tasks", addTask);
router.put("/:ideaId/tasks/:taskId", updateTask);
router.delete("/:ideaId/tasks/:taskId", deleteTask);

// 작업 순서 일괄 업데이트
router.put("/:ideaId/reorder", updateTasksOrder);

export default router;
