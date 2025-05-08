import { db } from "../db.js";

// 특정 아이디어의 칸반 컬럼 초기화
export const initColumns = (req, res) => {
  const { ideaId } = req.params;

  // 이미 칸반 컬럼이 있는지 확인
  const checkQuery = "SELECT * FROM ITAsset_kanban_columns WHERE idea_id = ?";

  db.query(checkQuery, [ideaId], (err, data) => {
    if (err) return res.status(500).json(err);

    // 이미 컬럼이 있으면 반환
    if (data.length > 0) {
      return res.status(200).json(data);
    }

    // 기본 컬럼 데이터
    const defaultColumns = [
      { column_id: "todo", title: "To do", position: 0 },
      { column_id: "kickoff", title: "Kick Off", position: 1 },
      { column_id: "inprogress", title: "In Progress", position: 2 },
      { column_id: "done", title: "Done", position: 3 },
    ];

    // 컬럼 추가
    const insertQuery =
      "INSERT INTO ITAsset_kanban_columns(idea_id, column_id, title, position) VALUES ?";
    const values = defaultColumns.map((col) => [
      ideaId,
      col.column_id,
      col.title,
      col.position,
    ]);

    db.query(insertQuery, [values], (err, result) => {
      if (err) return res.status(500).json(err);

      // 추가된 컬럼 반환
      db.query(checkQuery, [ideaId], (err, columnsData) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(columnsData);
      });
    });
  });
};

// 특정 아이디어의 모든 작업 조회
export const getTasks = (req, res) => {
  const { ideaId } = req.params;

  const query = `
    SELECT * FROM ITAsset_kanban_tasks 
    WHERE idea_id = ? 
    ORDER BY status, position
  `;

  db.query(query, [ideaId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// 새 작업 추가
export const addTask = (req, res) => {
  const { ideaId } = req.params;
  const { task_id, content, status, position } = req.body;

  const query = `
    INSERT INTO ITAsset_kanban_tasks
    (task_id, idea_id, content, status, position) 
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [task_id, ideaId, content, status || "todo", position || 0];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json(err);

    // 추가된 작업 반환
    db.query(
      "SELECT * FROM ITAsset_kanban_tasks WHERE id = ?",
      [result.insertId],
      (err, taskData) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json(taskData[0]);
      }
    );
  });
};

// 작업 수정
export const updateTask = (req, res) => {
  const { ideaId, taskId } = req.params;
  const { content, status, position } = req.body;

  // 수정할 필드만 포함하는 업데이트 쿼리 구성
  let updateQuery = "UPDATE ITAsset_kanban_tasks SET ";
  const updateValues = [];
  let hasUpdates = false;

  if (content !== undefined) {
    updateQuery += "content = ?, ";
    updateValues.push(content);
    hasUpdates = true;
  }

  if (status !== undefined) {
    updateQuery += "status = ?, ";
    updateValues.push(status);
    hasUpdates = true;
  }

  if (position !== undefined) {
    updateQuery += "position = ?, ";
    updateValues.push(position);
    hasUpdates = true;
  }

  // 업데이트할 내용이 없으면 바로 반환
  if (!hasUpdates) {
    return res.status(400).json({ message: "업데이트할 내용이 없습니다." });
  }

  // 마지막 콤마 제거 및 WHERE 조건 추가
  updateQuery = updateQuery.slice(0, -2);
  updateQuery += " WHERE task_id = ? AND idea_id = ?";
  updateValues.push(taskId, ideaId);

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "해당 작업을 찾을 수 없습니다." });
    }

    // 수정된 작업 반환
    db.query(
      "SELECT * FROM ITAsset_kanban_tasks WHERE task_id = ? AND idea_id = ?",
      [taskId, ideaId],
      (err, taskData) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(taskData[0]);
      }
    );
  });
};

// 작업 삭제
export const deleteTask = (req, res) => {
  const { ideaId, taskId } = req.params;

  const query =
    "DELETE FROM ITAsset_kanban_tasks WHERE task_id = ? AND idea_id = ?";

  db.query(query, [taskId, ideaId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "해당 작업을 찾을 수 없습니다." });
    }

    return res.status(200).json({ message: "작업이 삭제되었습니다." });
  });
};

// 작업 순서 일괄 변경
export const updateTasksOrder = (req, res) => {
  const { ideaId } = req.params;
  const { tasks } = req.body;

  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ message: "유효한 작업 목록이 필요합니다." });
  }

  // 트랜잭션 시작
  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    let hasError = false;
    let processedCount = 0;

    // 각 작업에 대해 순서와 상태 업데이트
    tasks.forEach((task) => {
      const { task_id, status, position } = task;

      const query =
        "UPDATE ITAsset_kanban_tasks SET status = ?, position = ? WHERE task_id = ? AND idea_id = ?";

      db.query(query, [status, position, task_id, ideaId], (err, result) => {
        if (err && !hasError) {
          hasError = true;
          return db.rollback(() => res.status(500).json(err));
        }

        processedCount++;

        // 모든 작업이 처리되었으면 트랜잭션 완료
        if (processedCount === tasks.length && !hasError) {
          db.commit((err) => {
            if (err) return db.rollback(() => res.status(500).json(err));

            // 업데이트된 작업 목록 반환
            getTasks(req, res);
          });
        }
      });
    });
  });
};
