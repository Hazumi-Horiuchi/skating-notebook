import { useState, useEffect } from "react"
import "./App.css"


function App() {
  // -----------------------------
  // 画面管理
  // -----------------------------
  const [screen, setScreen] = useState("home")

  // -----------------------------
  // 練習の基本情報
  // -----------------------------
  const [practiceDate, setPracticeDate] = useState("")
  const [practiceType, setPracticeType] = useState("自主練")
  const [goal, setGoal] = useState("")

  // -----------------------------
  // エレメンツ選択
  // -----------------------------
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedElement, setSelectedElement] = useState("")
  const [selectedElements, setSelectedElements] = useState([])
  const [elementSearch, setElementSearch] = useState("")
  const [selectedJumps, setSelectedJumps] = useState([""])
  const [selectedSpins, setSelectedSpins] = useState([
    {
      type: "",
      positions: [""]
    }
  ])

  // -----------------------------
  // 練習記録
  // -----------------------------
  const [attempts, setAttempts] = useState([])
  const [recordMode, setRecordMode] = useState("")
  const [timedDuration, setTimedDuration] = useState("")
  const [timedResult, setTimedResult] = useState("")
  const [timedMemo, setTimedMemo] = useState("")

  // -----------------------------
  // セッション振り返り
  // -----------------------------
  const [sessionDuration, setSessionDuration] = useState("")
  const [coachAdvice, setCoachAdvice] = useState("")
  const [accomplishments, setAccomplishments] = useState("")
  const [nextTask, setNextTask] = useState("")
  const [freeMemo, setFreeMemo] = useState("")

  // -----------------------------
  // 練習記録
  // -----------------------------
  const [practiceRecords, setPracticeRecords] = useState(() => {
    const savedRecords = localStorage.getItem("practiceRecords")

    if (savedRecords) {
      try {
        return JSON.parse(savedRecords)
      } catch (error) {
        console.error("練習記録の読み込みに失敗しました", error)
        return []
      }
    }

    return []
  })

  const [selectedRecord, setSelectedRecord] = useState(null)

  // practiceRecordsが変更されたら保存
  useEffect(() => {
    localStorage.setItem(
      "practiceRecords",
      JSON.stringify(practiceRecords)
    )
  }, [practiceRecords])

  // -----------------------------
  // エレメンツ一覧
  // -----------------------------
  const elementOptions = {
    ジャンプ: [
      "ワルツジャンプ",
      "1T",
      "1S",
      "1Lo",
      "1F",
      "1Lz",
      "1A",
      "1Eu",
      "2T",
      "2S",
      "2Lo",
      "2F",
      "2Lz",
      "2A",
    ],
    スピン: [
      "アップライトスピン",
      "シットスピン",
      "キャメルスピン",
      "レイバックスピン",
    ],
    "ステップ・ターン":[],
  }

  const spinPositionOptions = {
    "アップライトスピン": [
      "アップライト基本姿勢",
      "Y字スピン",
      "A字スピン",
      "I字スピン",
    ],

    "シットスピン": [
      "シット基本姿勢",
      "パンケーキ",
      "ブロークンレッグ",
      "キャノンボール",
    ],

    "キャメルスピン": [
      "キャメル基本姿勢",
      "キャッチフット",
      "ドーナツ",
    ],

    "レイバックスピン": [
      "レイバック基本姿勢",
      "ヘアカッター",
      "ビールマン",
    ],
  }

  // -----------------------------
  // 練習記録の操作
  // -----------------------------
  const addAttempt = () => {
    const newAttempt = {
      id: Date.now(),
      result: "",
      memo: "",
    }

    setAttempts((prevAttempts) => [
      ...prevAttempts,
      newAttempt,
    ])
  }

  const updateAttempt = (id, field, value) => {
    setAttempts((prevAttempts) =>
      prevAttempts.map((attempt) =>
        attempt.id === id
          ? { ...attempt, [field]: value }
          : attempt
      )
    )
  }

  const deleteAttempt = (id) => {
    if (attempts.length <= 1) {
      return
    }

    setAttempts((prevAttempts) =>
      prevAttempts.filter((attempt) => attempt.id !== id)
    )
  }

const saveCurrentElementAttempts = () => {
  setSelectedElements((prevElements) =>
    prevElements.map((element, index) =>
      index === prevElements.length - 1
        ? {
            ...element,
            attempts: [...attempts],
          }
        : element
    )
  )
}

const [editingElementIndex, setEditingElementIndex] = useState(null)
const [editingAttempts, setEditingAttempts] = useState([])
const updateEditingAttempt = (id, field, value) => {
  setEditingAttempts((prevAttempts) =>
    prevAttempts.map((attempt) =>
      attempt.id === id
        ? {
            ...attempt,
            [field]: value,
          }
        : attempt
    )
  )
}

const addEditingAttempt = () => {
  setEditingAttempts((prevAttempts) => [
    ...prevAttempts,
    {
      id: Date.now(),
      result: "",
      memo: "",
    },
  ])
}

const deleteEditingAttempt = (id) => {
  setEditingAttempts((prevAttempts) =>
    prevAttempts.filter((attempt) => attempt.id !== id)
  )
}

  // -----------------------------
  // 練習記録の編集
  // -----------------------------

const [editingElementInfoIndex, setEditingElementInfoIndex] = useState(null)
const [editingElementCategory, setEditingElementCategory] = useState("")
const [editingElementName, setEditingElementName] = useState("")
const [editingSpins, setEditingSpins] = useState([])
const [editingJumps, setEditingJumps] = useState([""])

  // -----------------------------
  // バックアップ
  // -----------------------------
  
const exportBackupJson = () => {
  const backupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    practiceRecords,
  }

  const json = JSON.stringify(backupData, null, 2)

  const blob = new Blob([json], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")

  const today = new Date()
    .toISOString()
    .slice(0, 10)

  link.href = url
  link.download = `skating-notebook-backup-${today}.json`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

  // -----------------------------
  // JSONからバックアップ復元
  // -----------------------------

const importBackupJson = (event) => {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const backupData = JSON.parse(e.target.result)

      if (
        !backupData ||
        !Array.isArray(backupData.practiceRecords)
      ) {
        alert("正しいバックアップファイルではありません。")
        return
      }

      const confirmed = window.confirm(
        "現在の練習記録をバックアップ内容で置き換えますか？\n現在の記録は上書きされます。"
      )

      if (!confirmed) {
        return
      }

      setPracticeRecords(backupData.practiceRecords)

      alert("バックアップから復元しました。")
    } catch (error) {
      console.error(error)

      alert(
        "バックアップファイルの読み込みに失敗しました。"
      )
    }
  }

  reader.readAsText(file)

  event.target.value = ""
}

  // -----------------------------
  // CSV書き出し
  // -----------------------------
const exportRecordsCsv = () => {
  const sortedRecords = [...practiceRecords].sort((a, b) => {
    if (a.date === b.date) {
      return a.id - b.id
    }

    return b.date.localeCompare(a.date)
  })

  const rows = [
    [
      "練習日",
      "練習区分",
      "練習時間",
      "今日の目標",
      "エレメンツ",
      "今日できたこと",
      "次回の課題",
      "コーチからのアドバイス",
      "自由メモ",
    ],
  ]

  sortedRecords.forEach((record) => {
    const elementSummary = (record.elements || [])
      .map((element) => {
        // 時間でまとめて記録した場合
        if (
          element.recordMode === "timed" &&
          element.timedRecord
        ) {
          const duration =
            element.timedRecord.duration || ""

          const result =
            element.timedRecord.result || ""

          const memo =
            element.timedRecord.memo || ""

          return `${element.category}:${element.name} ${duration}分 ${result}${
            memo ? ` メモ:${memo}` : ""
          }`
        }

        // 1本ずつ記録した場合
        const attempts = element.attempts || []

        const good = attempts.filter(
          (attempt) => attempt.result === "○"
        ).length

        const maybe = attempts.filter(
          (attempt) => attempt.result === "△"
        ).length

        const bad = attempts.filter(
          (attempt) => attempt.result === "×"
        ).length

        return `${element.category}:${element.name} ${attempts.length}本 ○${good} △${maybe} ×${bad}`
      })
      .join(" / ")

    rows.push([
      record.date || "",
      record.type || "",
      record.duration || "",
      record.goal || "",
      elementSummary,
      record.accomplishments || "",
      record.nextTask || "",
      record.coachAdvice || "",
      record.freeMemo || "",
    ])
  })

  const escapeCsvValue = (value) => {
    const stringValue = String(value ?? "")

    return `"${stringValue.replace(/"/g, '""')}"`
  }

  const csv = rows
    .map((row) =>
      row.map(escapeCsvValue).join(",")
    )
    .join("\n")

  const bom = "\uFEFF"

  const blob = new Blob([bom + csv], {
    type: "text/csv;charset=utf-8;",
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")

  const today = new Date()
    .toISOString()
    .slice(0, 10)

  link.href = url
  link.download = `skating-notebook-${today}.csv`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

  // -----------------------------
  // 練習履歴カレンダー表示
  // -----------------------------
const [calendarMonth, setCalendarMonth] = useState(() => {
  const today = new Date()

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )
})

const [selectedHistoryDate, setSelectedHistoryDate] = useState(null)

const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

// -----------------------------
// 最近使ったエレメンツ
// -----------------------------
const recentElements = []

;[...practiceRecords]
  .sort((a, b) => b.id - a.id)
  .forEach((record) => {
    ;[...(record.elements || [])]
      .reverse()
      .forEach((element) => {
        const sameCategoryCount = recentElements.filter(
          (recentElement) =>
            recentElement.category === element.category
        ).length

        const alreadyExists = recentElements.some(
          (recentElement) =>
            recentElement.category === element.category &&
            recentElement.name === element.name
        )

        if (!alreadyExists && sameCategoryCount < 4) {
          recentElements.push({
            category: element.category,
            name: element.name,
            jumps: element.jumps || null,
            spins: element.spins || null,
          })
        }
      })
  })

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    })
  }, [screen])

  // -----------------------------
  // ホーム画面
  // -----------------------------
  if (screen === "home") {
    return (
      <div className="screen">
        <div className="page-header">
          <h1>⛸️ フィギュアスケート練習ノート</h1>
          <p>今日の練習を記録しましょう</p>
        </div>

        <div className="button-group">
          <button
            className="main-button"
            onClick={() => {
              setPracticeDate(
                new Date().toISOString().slice(0, 10)
              )
              setSelectedElements([])
              setAttempts([])
              setScreen("record")
            }}
          >
            ＋ 練習を記録する
          </button>

          <button
            className="secondary-button"
            onClick={() => setScreen("history")}
          >
            練習履歴
          </button>

          <button
            className="secondary-button"
            onClick={() => setScreen("settings")}
          >
            設定
          </button>
        </div>
      </div>
    )
  }

  // -----------------------------
  // 基本情報入力画面
  // -----------------------------
  if (screen === "record") {
    return (
      <div className="screen">
        <div className="page-header">
          <h2>練習の基本情報</h2>
          <p>今日の練習について入力しましょう。</p>
        </div>

        <div className="form-group">
          <label>練習日</label>
          <input
            type="date"
            value={practiceDate}
            onChange={(e) => setPracticeDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>練習区分</label>
          <select
            value={practiceType}
            onChange={(e) => setPracticeType(e.target.value)}
          >
            <option value="自主練">自主練</option>
            <option value="個人レッスン">個人レッスン</option>
            <option value="グループレッスン">
              グループレッスン
            </option>
            <option value="その他">その他</option>
          </select>
        </div>

        <div className="form-group">
          <label>今日の目標</label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="今日の目標を入力"
            rows="4"
          />
        </div>

        <button
          className="complete-button"
          onClick={() => setScreen("elementSelect")}
        >
          次へ：エレメンツを選択
        </button>

        <button
          className="secondary-button"
          onClick={() => setScreen("home")}
        >
          ホームに戻る
        </button>
      </div>
    )
  }
 
  // -----------------------------
  // エレメンツ選択画面
  // -----------------------------
  if (screen === "elementSelect") {
    const recentCategoryElements = selectedCategory
      ? recentElements.filter(
          (element) => element.category === selectedCategory
        )
      : []

    const searchResults =
      selectedCategory && elementSearch
        ? elementOptions[selectedCategory].filter((element) =>
            element
              .toLowerCase()
              .includes(elementSearch.toLowerCase())
          )
        : []
      
      const jumpElementName =
        selectedCategory === "ジャンプ"
          ? selectedJumps.filter(Boolean).join("+")
          : ""

        const spinElementName =
          selectedCategory === "スピン"
            ? selectedSpins
                .map((spin) => {
                  const positionsText = spin.positions
                    .filter(Boolean)
                    .join("→")

                  if (!spin.type) {
                    return ""
                  }

                  if (!positionsText) {
                    return spin.type
                  }

                  return `${spin.type}（${positionsText}）`
                })
                .filter(Boolean)
                .join("→")
            : ""

      const canStartPractice =
        selectedCategory === "ジャンプ"
          ? selectedJumps.length > 0 &&
            selectedJumps.every((jump) => jump !== "")
          : selectedCategory === "スピン"
          ? selectedSpins.length > 0 &&
            selectedSpins.every(
              (spin) =>
                spin.type !== "" &&
                spin.positions.length > 0 &&
                spin.positions.every(
                  (position) => position !== ""
                )
            )
          : selectedElement !== ""

    return (
      <div className="screen">
        <div className="page-header">
          <h2>練習するエレメンツ</h2>
          <p>練習する項目を選択してください。</p>
        </div>

        {/* カテゴリー */}
        <div className="form-group">
          <label>カテゴリー</label>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setSelectedElement("")
              setElementSearch("")

              setSelectedJumps([""])

              setSelectedSpins([
                {
                  type: "",
                  positions: [""]
                }
              ])
            }}
          >
            <option value="">カテゴリーを選択</option>

            {Object.keys(elementOptions).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 最近使った項目 */}
        {selectedCategory && recentCategoryElements.length > 0 && (
          <div className="recent-elements-section">
            <h3>最近使った{selectedCategory}</h3>

            <div className="recent-elements-buttons">
              {recentCategoryElements.map((element) => (
                <button
                  key={`${element.category}-${element.name}`}
                  className={`recent-element-button ${
                    selectedElement === element.name
                      ? "recent-element-selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedElement(element.name)
                    setElementSearch("")

                    // ジャンプ
                    if (selectedCategory === "ジャンプ") {
                      if (element.jumps?.length) {
                        setSelectedJumps(
                          element.jumps.map((jump) => jump.name)
                        )
                      } else {
                        // 古い記録への対応
                        setSelectedJumps([element.name])
                      }
                    }

                    // スピン
                    if (selectedCategory === "スピン") {
                      if (element.spins?.length) {
                        setSelectedSpins(
                          element.spins.map((spin) => ({
                            type: spin.type,
                            positions: [...spin.positions],
                          }))
                        )
                      } else {
                        // 古い記録への対応
                        setSelectedSpins([
                          {
                            type: element.name,
                            positions: [""],
                          },
                        ])
                      }
                    }
                  }}
                >
                  {element.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 検索 */}
          {/* ジャンプの場合 */}
          {selectedCategory === "ジャンプ" && (
            <div className="jump-combination-section">
              {selectedJumps.map((jump, index) => (
                <div
                  className="jump-select-row"
                  key={index}
                >
                  <div className="form-group jump-select-group">
                    <label>
                      第{index + 1}ジャンプ
                    </label>

                    <select
                      value={jump}
                      onChange={(e) => {
                        const newJumps = [...selectedJumps]

                        newJumps[index] = e.target.value

                        setSelectedJumps(newJumps)

                        // 現段階では第1ジャンプを
                        // selectedElementにも入れておく
                        if (index === 0) {
                          setSelectedElement(e.target.value)
                        }

                        setElementSearch("")
                      }}
                    >
                      <option value="">
                        ジャンプを選択
                      </option>

                      {elementOptions["ジャンプ"].map((element) => (
                        <option key={element} value={element}>
                          {element}
                        </option>
                      ))}
                    </select>
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      className="jump-delete-button"
                      onClick={() => {
                        setSelectedJumps((prevJumps) =>
                          prevJumps.filter(
                            (_, jumpIndex) =>
                              jumpIndex !== index
                          )
                        )
                      }}
                    >
                      削除
                    </button>
                  )}
                </div>
              ))}

              {selectedJumps.length < 3 && (
                <button
                  type="button"
                  className="add-jump-button"
                  disabled={
                    !selectedJumps[
                      selectedJumps.length - 1
                    ]
                  }
                  onClick={() => {
                    setSelectedJumps((prevJumps) => [
                      ...prevJumps,
                      "",
                    ])
                  }}
                >
                  ＋ 第{selectedJumps.length + 1}
                  ジャンプを追加
                </button>
              )}
            </div>
          )}

          {/* スピンの場合 */}
          {selectedCategory === "スピン" && (
            <div className="spin-input-section">
              {selectedSpins.map((spin, spinIndex) => (
                <div
                  className="spin-block"
                  key={spinIndex}
                >
                  <h3>スピン{spinIndex + 1}</h3>

                  {/* スピン種別 */}
                  <div className="form-group">
                    <label>スピン種別</label>

                    <select
                      value={spin.type}
                      onChange={(e) => {
                        const newSpins = [...selectedSpins]

                        newSpins[spinIndex] = {
                          ...newSpins[spinIndex],
                          type: e.target.value,
                          positions: [""],
                        }

                        setSelectedSpins(newSpins)

                        if (spinIndex === 0) {
                          setSelectedElement(e.target.value)
                        }

                        setElementSearch("")
                      }}
                    >
                      <option value="">
                        スピン種別を選択
                      </option>

                      {elementOptions["スピン"].map((element) => (
                        <option
                          key={element}
                          value={element}
                        >
                          {element}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 姿勢 */}
                  {spin.positions.map((position, positionIndex) => (
                    <div
                      className="spin-position-row"
                      key={positionIndex}
                    >
                      <div className="form-group spin-position-group">
                        <label>
                          姿勢{positionIndex + 1}
                        </label>

                        <select
                          value={position}
                          onChange={(e) => {
                            const newSpins = [...selectedSpins]

                            const newPositions = [
                              ...newSpins[spinIndex].positions,
                            ]

                            newPositions[positionIndex] =
                              e.target.value

                            newSpins[spinIndex] = {
                              ...newSpins[spinIndex],
                              positions: newPositions,
                            }

                            setSelectedSpins(newSpins)
                          }}
                        >
                          <option value="">
                            姿勢を選択
                          </option>

                          {(spinPositionOptions[spin.type] || []).map(
                            (spinPosition) => (
                              <option
                                key={spinPosition}
                                value={spinPosition}
                              >
                                {spinPosition}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* 姿勢2以降は削除できる */}
                      {positionIndex > 0 && (
                        <button
                          type="button"
                          className="spin-position-delete-button"
                          onClick={() => {
                            const newSpins = [...selectedSpins]

                            newSpins[spinIndex] = {
                              ...newSpins[spinIndex],
                              positions:
                                newSpins[spinIndex].positions.filter(
                                  (_, index) =>
                                    index !== positionIndex
                                ),
                            }

                            setSelectedSpins(newSpins)
                          }}
                        >
                          削除
                        </button>
                      )}
                    </div>
                  ))}

                  {/* このスピンの姿勢を追加 */}
                  {spin.positions.length < 4 && (
                    <button
                      type="button"
                      className="add-spin-position-button"
                      disabled={
                        !spin.type ||
                        !spin.positions[
                          spin.positions.length - 1
                        ]
                      }
                      onClick={() => {
                        const newSpins = [...selectedSpins]

                        newSpins[spinIndex] = {
                          ...newSpins[spinIndex],
                          positions: [
                            ...newSpins[spinIndex].positions,
                            "",
                          ],
                        }

                        setSelectedSpins(newSpins)
                      }}
                    >
                      ＋ 姿勢
                      {spin.positions.length + 1}
                      を追加
                    </button>
                  )}

                  {/* スピン2以降はカードごと削除 */}
                  {spinIndex > 0 && (
                    <button
                      type="button"
                      className="spin-position-delete-button"
                      onClick={() => {
                        setSelectedSpins((prevSpins) =>
                          prevSpins.filter(
                            (_, index) => index !== spinIndex
                          )
                        )
                      }}
                    >
                      このスピンを削除
                    </button>
                  )}
                </div>
              ))}

              {/* 新しいスピンを追加 */}
              {selectedSpins.length < 4 && (
                <button
                  type="button"
                  className="add-spin-position-button"
                  disabled={
                    !selectedSpins[
                      selectedSpins.length - 1
                    ].type ||
                    selectedSpins[
                      selectedSpins.length - 1
                    ].positions.some(
                      (position) => position === ""
                    )
                  }
                  onClick={() => {
                    setSelectedSpins((prevSpins) => [
                      ...prevSpins,
                      {
                        type: "",
                        positions: [""],
                      },
                    ])
                  }}
                >
                  ＋ スピン
                  {selectedSpins.length + 1}
                  を追加
                </button>
              )}
            </div>
          )}

        {/* 検索結果 */}
        {selectedCategory && elementSearch && (
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((element) => (
                <button
                  key={element}
                  className={`search-result-button ${
                    selectedElement === element
                      ? "search-result-selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedElement(element)

                    if (selectedCategory === "ジャンプ") {
                      setSelectedJumps([element])
                    }

                    if (selectedCategory === "スピン") {
                      setSelectedSpins([
                        {
                          type: element.name,
                          positions: [""],
                        },
                      ])
                    }
                  }}
                >
                  {element}
                </button>
              ))
            ) : (
              <p className="empty-message">
                該当する練習項目がありません。
              </p>
            )}
          </div>
        )}

        {/* ステップ・ターンは自由入力 */}
        {selectedCategory === "ステップ・ターン" && (
          <div className="form-group">
            <label>練習項目</label>

            <input
              type="text"
              value={selectedElement}
              onChange={(e) => {
                setSelectedElement(e.target.value)
                setElementSearch("")
              }}
              placeholder="例：右FOスリー、ダブルスリー、6ステップ"
            />
          </div>
        )}

        {selectedCategory === "ジャンプ" && jumpElementName && (
          <div className="jump-selection-preview">
            <span>選択中：</span>
            <strong>{jumpElementName}</strong>
          </div>
        )}

        {selectedCategory === "スピン" && spinElementName && (
          <div className="jump-selection-preview">
            <span>選択中：</span>
            <strong>{spinElementName}</strong>
          </div>
        )}

        <button
          className="complete-button"
          disabled={!canStartPractice}
          onClick={() => {
            const newElement =
              selectedCategory === "ジャンプ"
                ? {
                    category: "ジャンプ",
                    name: jumpElementName,
                    jumps: selectedJumps.map((jump) => ({
                      name: jump,
                    })),
                    attempts: [],
                  }
                : selectedCategory === "スピン"
                ? {
                    category: "スピン",
                    name: spinElementName,
                    spins: selectedSpins.map((spin) => ({
                      type: spin.type,
                      positions: [...spin.positions],
                    })),
                    attempts: [],
                  }
                : {
                    category: selectedCategory,
                    name: selectedElement,
                    attempts: [],
                  }

            setSelectedElements((prevElements) => [
              ...prevElements,
              newElement,
            ])

            setAttempts([
              {
                id: Date.now(),
                result: "",
                memo: "",
              },
            ])

            setRecordMode("")
            setTimedDuration("")
            setTimedResult("")
            setTimedMemo("")
            setScreen("recordModeSelect")
          }}
        >
          このエレメンツの練習を開始
        </button>

        <button
          className="secondary-button"
          onClick={() => {
            if (selectedElements.length === 0) {
              setScreen("record")
            } else {
              setScreen("elementComplete")
            }
          }}
        >
          {selectedElements.length === 0
            ? "基本情報に戻る"
            : "前の画面に戻る"}
        </button>
      </div>
    )
  }

  // -----------------------------
  // 記録方法選択画面
  // -----------------------------
  if (screen === "recordModeSelect") {
    const currentElement =
      selectedElements[selectedElements.length - 1]

    return (
      <div className="screen">
        <div className="page-header">
          <h2>記録方法を選択</h2>

          {currentElement && (
            <p>
              {currentElement.category}：
              {currentElement.name}
            </p>
          )}
        </div>

        <div className="complete-options">
          <button
            className="main-button"
            onClick={() => {
              setRecordMode("attempt")
              setScreen("elementRecord")
            }}
          >
            1本ずつ記録する
          </button>

          <button
            className="main-button"
            onClick={() => {
              setRecordMode("timed")
              setScreen("timedRecord")
            }}
          >
            時間でまとめて記録する
          </button>
        </div>

        <button
          className="secondary-button"
          onClick={() => {
            setSelectedElements((prevElements) =>
              prevElements.slice(0, -1)
            )

            setAttempts([])
            setRecordMode("")
            setScreen("elementSelect")
          }}
        >
          練習項目の選択に戻る
        </button>
      </div>
    )
  }

  // -----------------------------
  // 時間でまとめて練習記録
  // -----------------------------
  if (screen === "timedRecord") {
    const currentElement =
      selectedElements[selectedElements.length - 1]

    return (
      <div className="screen">
        <div className="page-header">
          <h2>エレメンツ練習記録</h2>

          {currentElement && (
            <p>
              {currentElement.category}：
              {currentElement.name}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>練習時間（分）</label>

          <input
            type="number"
            min="1"
            value={timedDuration}
            onChange={(e) =>
              setTimedDuration(e.target.value)
            }
            placeholder="例：5"
          />
        </div>

        <div className="form-group">
          <label>総合評価</label>

          <div className="result-buttons">
            <button
              type="button"
              className={`result-button ${
                timedResult === "○"
                  ? "selected-good"
                  : ""
              }`}
              onClick={() => setTimedResult("○")}
            >
              <span className="result-symbol result-good-symbol">
                ○
              </span>
            </button>

            <button
              type="button"
              className={`result-button ${
                timedResult === "△"
                  ? "selected-maybe"
                  : ""
              }`}
              onClick={() => setTimedResult("△")}
            >
              <span className="result-symbol result-maybe-symbol">
                △
              </span>
            </button>

            <button
              type="button"
              className={`result-button ${
                timedResult === "×"
                  ? "selected-bad"
                  : ""
              }`}
              onClick={() => setTimedResult("×")}
            >
              <span className="result-symbol result-bad-symbol">
                ×
              </span>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>メモ</label>

          <textarea
            value={timedMemo}
            onChange={(e) =>
              setTimedMemo(e.target.value)
            }
            placeholder="この練習についてのメモ"
            rows="4"
          />
        </div>

        <button
          className="complete-button"
          disabled={
            timedDuration === "" ||
            timedResult === ""
          }
          onClick={() => {
            setSelectedElements((prevElements) =>
              prevElements.map((element, index) =>
                index === prevElements.length - 1
                  ? {
                      ...element,
                      recordMode: "timed",
                      timedRecord: {
                        duration: timedDuration,
                        result: timedResult,
                        memo: timedMemo,
                      },
                      attempts: [],
                    }
                  : element
              )
            )

            setAttempts([])
            setScreen("elementComplete")
          }}
        >
          このエレメンツの練習を完了
        </button>

        <button
          className="secondary-button"
          onClick={() =>
            setScreen("recordModeSelect")
          }
        >
          記録方法の選択に戻る
        </button>
      </div>
    )
  }
  // -----------------------------
  // エレメンツ練習記録画面
  // -----------------------------
  if (screen === "elementRecord") {
    const currentElement =
      selectedElements[selectedElements.length - 1]

    return (
      <div className="screen">
        <div className="page-header">
          <h2>エレメンツ練習記録</h2>

          {currentElement && (
            <p>
              {currentElement.category}：
              {currentElement.name}
            </p>
          )}
        </div>

        {attempts.map((attempt, index) => (
          <div className="attempt-card" key={attempt.id}>
            <div className="attempt-header">
              <strong>{index + 1}本目</strong>

              <button
                className="delete-button"
                disabled={attempts.length <= 1}
                onClick={() => deleteAttempt(attempt.id)}
              >
                削除
              </button>
            </div>

           <div className="result-buttons">
              <button
                className={`result-button ${
                  attempt.result === "○"
                   ? "selected-good"
                    : ""
                  }`}
                onClick={() =>
                  updateAttempt(attempt.id, "result", "○")
                }
              >
               <span className="result-symbol result-good-symbol">○</span>
              </button>

              <button
                className={`result-button ${
                  attempt.result === "△"
                  ? "selected-maybe"
                  : ""
                  }`}
                onClick={() =>
                  updateAttempt(attempt.id, "result", "△")
                 }
              >
                <span className="result-symbol result-maybe-symbol">△</span>
              </button>

              <button
                className={`result-button ${
                  attempt.result === "×"
                    ? "selected-bad"
                    : ""
                    }`}
                onClick={() =>
               updateAttempt(attempt.id, "result", "×")
               }
              >
                <span className="result-symbol result-bad-symbol">×</span>
              </button>
            </div>

            <textarea
              value={attempt.memo}
              onChange={(e) =>
                updateAttempt(
                  attempt.id,
                  "memo",
                  e.target.value
                )
              }
              placeholder="この練習についてのメモ"
              rows="3"
            />
          </div>
        ))}

        <button
          className="add-attempt-button"
          onClick={addAttempt}
        >
          ＋ 練習を追加
        </button>

        <button
          className="complete-button"
          onClick={() => setScreen("elementComplete")}
        >
          このエレメンツの練習を完了
        </button>

        <button
          className="secondary-button"
          onClick={() => {
            const hasInput = attempts.some(
              (attempt) =>
                attempt.result !== "" ||
                attempt.memo.trim() !== ""
            )

            if (hasInput) {
              const confirmed = window.confirm(
                "入力中の○△×やメモは破棄されます。\n練習項目の選択に戻りますか？"
              )

              if (!confirmed) {
                return
              }
            }

            setSelectedElements((prevElements) =>
              prevElements.slice(0, -1)
            )

            setAttempts([])

            setScreen("elementSelect")
          }}
        >
          練習項目の選択に戻る
        </button>
      </div>
    )
  }

  // -----------------------------
  // エレメンツ練習完了画面
  // -----------------------------
  if (screen === "elementComplete") {
    return (
      <div className="screen">
        <div className="page-header">
           <h2>エレメンツの練習完了！</h2>
           <p>次に何をしますか？</p>
        </div>

        <div className="complete-options">
          <button
            className="main-button"
            onClick={() => {
               saveCurrentElementAttempts()
               setSelectedCategory("")
               setSelectedElement("")
               setAttempts([])
               setScreen("elementSelect")
              }}
          >
            ＋ 次のエレメンツを練習する
          </button>

          <button
            className="secondary-button"
            onClick={() => {
              saveCurrentElementAttempts()
              setScreen("sessionSummary")
            }}
          >
             このセッションを終了する
          </button>
        </div>
      </div>
    )
  }

  // -----------------------------
  // セッション振り返り画面
  // -----------------------------
  if (screen === "sessionSummary") {
    return (
      <div className="screen">
        <div className="page-header">
          <h2>セッションの振り返り</h2>
          <p>今日の練習を振り返りましょう。</p>
        </div>

        <div className="form-group">
          <label>練習時間（分）</label>
          <input
            type="number"
            min="0"
            value={sessionDuration}
            onChange={(e) =>
              setSessionDuration(e.target.value)
            }
            placeholder="例：60"
          />
        </div>

        <div className="form-group">
          <label>コーチからのアドバイス</label>
          <textarea
            value={coachAdvice}
            onChange={(e) =>
              setCoachAdvice(e.target.value)
            }
            placeholder="コーチからのアドバイスを入力"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>今日できたこと</label>
          <textarea
            value={accomplishments}
            onChange={(e) =>
              setAccomplishments(e.target.value)
            }
            placeholder="今日できるようになったことを入力"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>次回の課題</label>
          <textarea
            value={nextTask}
            onChange={(e) => setNextTask(e.target.value)}
            placeholder="次回練習したいことを入力"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>自由メモ</label>
          <textarea
            value={freeMemo}
            onChange={(e) => setFreeMemo(e.target.value)}
            placeholder="その他、気づいたことなど"
            rows="4"
          />
        </div>

        <button
          className="complete-button"
          onClick={() => {
            const newRecord = {
              id: Date.now(),
              date: practiceDate,
              type: practiceType,
              goal: goal,
              duration: sessionDuration,
              coachAdvice: coachAdvice,
              accomplishments: accomplishments,
              nextTask: nextTask,
              freeMemo: freeMemo,
              elements: selectedElements,
              createdAt: new Date().toISOString(),
            }

            setPracticeRecords((prevRecords) => [
              ...prevRecords,
              newRecord,
            ])

            alert("練習記録を保存しました！")

            setScreen("sessionComplete")
          }}
        >
          振り返りを保存する
        </button>

        <button
          className="secondary-button"
          onClick={() => setScreen("elementComplete")}
        >
          戻る
        </button>
      </div>
    )
  }

  // -----------------------------
  // 練習履歴画面
  // -----------------------------
  if (screen === "history") {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)

    const lastDayOfMonth = new Date(
      year,
      month + 1,
      0
    )

    const firstWeekday = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    const calendarDays = []

    // 月初より前の空白
    for (let i = 0; i < firstWeekday; i++) {
      calendarDays.push(null)
    }

    // 1日〜月末
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(
        new Date(year, month, day)
      )
    }

    return (
      <div className="screen">
        <div className="page-header">
          <h2>練習履歴</h2>
          <p>
            保存された練習記録：
            {practiceRecords.length}件
          </p>
        </div>

        {/* 月切り替え */}
        <div className="calendar-header">
          <button
            className="calendar-nav-button"
            onClick={() => {
              setCalendarMonth(
                new Date(year, month - 1, 1)
              )
              setSelectedHistoryDate(null)
            }}
          >
            ＜
          </button>

          <h3>
            {year}年{month + 1}月
          </h3>

          <button
            className="calendar-nav-button"
            onClick={() => {
              setCalendarMonth(
                new Date(year, month + 1, 1)
              )
              setSelectedHistoryDate(null)
            }}
          >
            ＞
          </button>
        </div>

        {/* 曜日 */}
        <div className="calendar-weekdays">
          {["日", "月", "火", "水", "木", "金", "土"].map(
            (weekday) => (
              <div key={weekday}>
                {weekday}
              </div>
            )
          )}
        </div>

        {/* 日付 */}
        <div className="calendar-grid">
          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  className="calendar-empty"
                  key={`empty-${index}`}
                />
              )
            }

            const dateKey = formatDateKey(date)

            const recordsForDay =
              practiceRecords.filter(
                (record) =>
                  record.date === dateKey
              )

            const hasRecord =
              recordsForDay.length > 0

            const isSelected =
              selectedHistoryDate === dateKey

            return (
              <button
                key={dateKey}
                className={`calendar-day ${
                  hasRecord
                    ? "has-record"
                    : ""
                } ${
                  isSelected
                    ? "selected-day"
                    : ""
                }`}
                onClick={() => {
                  setSelectedHistoryDate(dateKey)
                  setScreen("historyDay")
                }}
              >
                <span className="calendar-day-number">
                  {date.getDate()}
                </span>

                {hasRecord && (
                  <span className="calendar-record-count">
                    {recordsForDay.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <button
          className="secondary-button"
          onClick={() => setScreen("home")}
        >
          ホームに戻る
        </button>
      </div>
    )
  }

  // -----------------------------
  // 練習履歴の詳細画面
  // -----------------------------
  if (screen === "historyDetail") {
    if (!selectedRecord) {
      return (
        <div className="screen">
          <p>表示する記録がありません。</p>

          <button
            className="secondary-button"
            onClick={() => setScreen("historyDay")}
          >
            練習履歴に戻る
          </button>
        </div>
      )
    }

    return (
      <div className="screen">
        <div className="page-header">
          <h2>練習記録の詳細</h2>
          <p>{selectedRecord.date}</p>
        </div>

        <div className="detail-card">
          <div className="detail-row">
            <strong>練習区分</strong>
            <span>{selectedRecord.type}</span>
          </div>

          <div className="detail-row">
            <strong>練習時間</strong>
            <span>
              {selectedRecord.duration
                ? `${selectedRecord.duration}分`
                : "未入力"}
            </span>
          </div>

          {selectedRecord.goal && (
            <div className="detail-section">
              <h3>今日の目標</h3>
              <p>{selectedRecord.goal}</p>
            </div>
          )}

          <div className="detail-section">
            <h3>練習したエレメンツ</h3>

            {selectedRecord.elements &&
            selectedRecord.elements.length > 0 ? (
              <div className="detail-elements-list">
                {selectedRecord.elements.map((element, index) => (
                  <div className="detail-element" key={index}>
                    <div className="detail-element-title">
                      {element.category}：{element.name}
                    </div>

                    {element.recordMode === "timed" && element.timedRecord ? (
                      <div className="detail-attempts">
                        <div className="detail-attempt">
                          <span
                            className={`detail-result ${
                              element.timedRecord.result === "○"
                                ? "detail-result-good"
                                : element.timedRecord.result === "△"
                                ? "detail-result-maybe"
                                : element.timedRecord.result === "×"
                                ? "detail-result-bad"
                                : ""
                            }`}
                          >
                            {element.timedRecord.result || "－"}
                          </span>

                          <span className="detail-attempt-number">
                            {element.timedRecord.duration}分
                          </span>

                          {element.timedRecord.memo && (
                            <span className="detail-attempt-memo">
                              {element.timedRecord.memo}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : element.attempts && element.attempts.length > 0 ? (
                      <>
                        <div className="attempt-summary">
                          <span className="attempt-total">
                            {element.attempts.length}本
                          </span>

                          <span className="summary-good">
                            ○{" "}
                            {
                              element.attempts.filter(
                                (attempt) => attempt.result === "○"
                              ).length
                            }
                          </span>

                          <span className="summary-maybe">
                            △{" "}
                            {
                              element.attempts.filter(
                                (attempt) => attempt.result === "△"
                              ).length
                            }
                          </span>

                          <span className="summary-bad">
                            ×{" "}
                            {
                              element.attempts.filter(
                                (attempt) => attempt.result === "×"
                              ).length
                            }
                          </span>
                        </div>

                        <div className="detail-attempts">
                          {element.attempts.map(
                            (attempt, attemptIndex) => (
                              <div
                                className="detail-attempt"
                                key={attempt.id ?? attemptIndex}
                              >
                                <span
                                  className={`detail-result ${
                                    attempt.result === "○"
                                      ? "detail-result-good"
                                      : attempt.result === "△"
                                      ? "detail-result-maybe"
                                      : attempt.result === "×"
                                      ? "detail-result-bad"
                                      : ""
                                  }`}
                                >
                                  {attempt.result || "－"}
                                </span>

                                <span className="detail-attempt-number">
                                  {attemptIndex + 1}本目
                                </span>

                                {attempt.memo && (
                                  <span className="detail-attempt-memo">
                                    {attempt.memo}
                                  </span>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="detail-no-attempts">
                        練習記録はありません
                      </p>
                    )}

                    <button
                      className="element-edit-button"
                      onClick={() => {
                        setEditingElementIndex(index)

                        if (
                          element.recordMode === "timed" &&
                          element.timedRecord
                        ) {
                          setTimedDuration(
                            element.timedRecord.duration || ""
                          )
                          setTimedResult(
                            element.timedRecord.result || ""
                          )
                          setTimedMemo(
                            element.timedRecord.memo || ""
                          )

                          setScreen("editTimedRecord")
                          return
                        }

                        setEditingAttempts(
                          (element.attempts || []).map((attempt) => ({
                            ...attempt,
                          }))
                        )

                        setScreen("editElementAttempts")
                      }}
                    >
                      {element.recordMode === "timed"
                        ? "時間記録を編集"
                        : "○△×・メモを編集"}
                    </button>

                    <button
                      className="element-info-edit-button"
                      onClick={() => {
                        setEditingElementInfoIndex(index)
                        setEditingElementCategory(element.category)
                        setEditingElementName(element.name)

                        if (element.category === "ジャンプ") {
                          if (element.jumps?.length) {
                            setEditingJumps(
                              element.jumps.map((jump) => jump.name)
                            )
                          } else {
                            setEditingJumps([element.name])
                          }
                        } else {
                          setEditingJumps([""])
                        }

                        if (element.category === "スピン") {
                          setEditingSpins(
                            element.spins
                              ? element.spins.map((spin) => ({
                                  type: spin.type,
                                  positions: [...spin.positions],
                                }))
                              : [
                                  {
                                    type: element.name,
                                    positions: [""],
                                  },
                                ]
                          )
                        } else {
                          setEditingSpins([])
                        }

                        setScreen("editElementInfo")
                      }}
                    >
                      エレメンツを変更
                    </button>

                    <button
                      className="element-delete-button"
                      onClick={() => {
                        const confirmed = window.confirm(
                          `${element.category}：${element.name} を削除しますか？\n練習記録もすべて削除されます。`
                        )

                        if (!confirmed) {
                          return
                        }

                        const updatedElements = selectedRecord.elements.filter(
                          (_, elementIndex) => elementIndex !== index
                        )

                        const updatedRecord = {
                          ...selectedRecord,
                          elements: updatedElements,
                        }

                        setPracticeRecords((prevRecords) =>
                          prevRecords.map((record) =>
                            record.id === selectedRecord.id
                              ? updatedRecord
                              : record
                          )
                        )

                        setSelectedRecord(updatedRecord)
                      }}
                    >
                      このエレメンツを削除
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>記録されたエレメンツはありません。</p>
            )}
          </div>

          {selectedRecord.accomplishments && (
            <div className="detail-section">
              <h3>今日できたこと</h3>
              <p>{selectedRecord.accomplishments}</p>
            </div>
          )}

          {selectedRecord.coachAdvice && (
            <div className="detail-section">
              <h3>コーチからのアドバイス</h3>
              <p>{selectedRecord.coachAdvice}</p>
            </div>
          )}

          {selectedRecord.nextTask && (
            <div className="detail-section">
              <h3>次回の課題</h3>
              <p>{selectedRecord.nextTask}</p>
            </div>
          )}

          {selectedRecord.freeMemo && (
            <div className="detail-section">
              <h3>自由メモ</h3>
              <p>{selectedRecord.freeMemo}</p>
            </div>
          )}
        </div>

        <div className="detail-actions">

          <button
            className="main-button"
            onClick={() => {
              setPracticeDate(selectedRecord.date)
              setPracticeType(selectedRecord.type)
              setGoal(selectedRecord.goal || "")
              setSessionDuration(selectedRecord.duration || "")
              setCoachAdvice(selectedRecord.coachAdvice || "")
              setAccomplishments(selectedRecord.accomplishments || "")
              setNextTask(selectedRecord.nextTask || "")
              setFreeMemo(selectedRecord.freeMemo || "")
              setScreen("editRecord")
            }}
          >
            この記録を編集
          </button>

          <button
            className="record-delete-button"
            onClick={() => {
              const confirmed = window.confirm(
                "この練習記録を削除しますか？\n削除すると元に戻せません。"
              )

              if (!confirmed) {
                return
              }

              setPracticeRecords((prevRecords) =>
                prevRecords.filter(
                  (record) => record.id !== selectedRecord.id
                )
              )

              setSelectedRecord(null)
              setScreen("historyDay")
            }}
          >
            この記録を削除
          </button>

          <button
            className="secondary-button"
            onClick={() => setScreen("historyDay")}
          >
            練習履歴に戻る
          </button>

        </div>
      </div>
    )
  }

  // -----------------------------
  // 練習記録の編集画面
  // -----------------------------
  if (screen === "editRecord") {
    return (
      <div className="screen">
        <div className="page-header">
          <h2>練習記録を編集</h2>
          <p>内容を変更して保存できます</p>
        </div>

        <div className="edit-form-card">
          <div className="form-section">
            <h3 className="form-section-title">基本情報</h3>

            <div className="form-group">
              <label>練習日</label>
              <input
                type="date"
                value={practiceDate}
                onChange={(e) => setPracticeDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>練習区分</label>
              <select
                value={practiceType}
                onChange={(e) => setPracticeType(e.target.value)}
              >
                <option value="自主練">自主練</option>
                <option value="個人レッスン">個人レッスン</option>
                <option value="グループレッスン">グループレッスン</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div className="form-group">
              <label>練習時間（分）</label>
              <input
                type="number"
                min="0"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
                placeholder="例：60"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">振り返り</h3>

            <div className="form-group">
              <label>今日の目標</label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>コーチからのアドバイス</label>
              <textarea
                value={coachAdvice}
                onChange={(e) => setCoachAdvice(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>今日できたこと</label>
              <textarea
                value={accomplishments}
                onChange={(e) => setAccomplishments(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>次回の課題</label>
              <textarea
                value={nextTask}
                onChange={(e) => setNextTask(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>自由メモ</label>
              <textarea
                value={freeMemo}
                onChange={(e) => setFreeMemo(e.target.value)}
                rows="4"
              />
            </div>
          </div>
        </div>

        <button
          className="main-button"
          onClick={() => {
            setPracticeRecords((prevRecords) =>
              prevRecords.map((record) =>
                record.id === selectedRecord.id
                  ? {
                      ...record,
                      date: practiceDate,
                      type: practiceType,
                      goal,
                      duration: sessionDuration,
                      coachAdvice,
                      accomplishments,
                      nextTask,
                      freeMemo,
                    }
                  : record
              )
            )

            const updatedRecord = {
              ...selectedRecord,
              date: practiceDate,
              type: practiceType,
              goal,
              duration: sessionDuration,
              coachAdvice,
              accomplishments,
              nextTask,
              freeMemo,
            }

            setSelectedRecord(updatedRecord)
            setScreen("historyDetail")
          }}
        >
          変更を保存
        </button>

        <button
          className="secondary-button"
          onClick={() => setScreen("historyDetail")}
        >
          編集をキャンセル
        </button>
      </div>
    )
  }

  // -----------------------------
  // 時間記録の編集画面
  // -----------------------------
  if (screen === "editTimedRecord") {
    const editingElement =
      selectedRecord?.elements?.[editingElementIndex]

    if (!editingElement) {
      return (
        <div className="screen">
          <p>編集する記録がありません。</p>

          <button
            className="secondary-button"
            onClick={() =>
              setScreen("historyDetail")
            }
          >
            練習記録に戻る
          </button>
        </div>
      )
    }

    return (
      <div className="screen">
        <div className="page-header">
          <h2>時間記録を編集</h2>
          <p>
            {editingElement.category}：
            {editingElement.name}
          </p>
        </div>

        <div className="form-group">
          <label>練習時間（分）</label>

          <input
            type="number"
            min="1"
            value={timedDuration}
            onChange={(e) =>
              setTimedDuration(e.target.value)
            }
            placeholder="例：5"
          />
        </div>

        <div className="form-group">
          <label>総合評価</label>

          <div className="result-buttons">
            <button
              type="button"
              className={`result-button ${
                timedResult === "○"
                  ? "selected-good"
                  : ""
              }`}
              onClick={() =>
                setTimedResult("○")
              }
            >
              <span className="result-symbol result-good-symbol">
                ○
              </span>
            </button>

            <button
              type="button"
              className={`result-button ${
                timedResult === "△"
                  ? "selected-maybe"
                  : ""
              }`}
              onClick={() =>
                setTimedResult("△")
              }
            >
              <span className="result-symbol result-maybe-symbol">
                △
              </span>
            </button>

            <button
              type="button"
              className={`result-button ${
                timedResult === "×"
                  ? "selected-bad"
                  : ""
              }`}
              onClick={() =>
                setTimedResult("×")
              }
            >
              <span className="result-symbol result-bad-symbol">
                ×
              </span>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>メモ</label>

          <textarea
            value={timedMemo}
            onChange={(e) =>
              setTimedMemo(e.target.value)
            }
            placeholder="この練習についてのメモ"
            rows="4"
          />
        </div>

        <button
          className="main-button"
          disabled={
            timedDuration === "" ||
            timedResult === ""
          }
          onClick={() => {
            const updatedElements =
              selectedRecord.elements.map(
                (element, index) =>
                  index === editingElementIndex
                    ? {
                        ...element,
                        recordMode: "timed",
                        timedRecord: {
                          duration: timedDuration,
                          result: timedResult,
                          memo: timedMemo,
                        },
                        attempts: [],
                      }
                    : element
              )

            const updatedRecord = {
              ...selectedRecord,
              elements: updatedElements,
            }

            setPracticeRecords((prevRecords) =>
              prevRecords.map((record) =>
                record.id === selectedRecord.id
                  ? updatedRecord
                  : record
              )
            )

            setSelectedRecord(updatedRecord)

            setEditingElementIndex(null)
            setTimedDuration("")
            setTimedResult("")
            setTimedMemo("")

            setScreen("historyDetail")
          }}
        >
          変更を保存
        </button>

        <button
          className="secondary-button"
          onClick={() => {
            setEditingElementIndex(null)
            setTimedDuration("")
            setTimedResult("")
            setTimedMemo("")

            setScreen("historyDetail")
          }}
        >
          編集をキャンセル
        </button>
      </div>
    )
  }

  // -----------------------------
  // エレメンツ練習記録の編集画面
  // -----------------------------
  if (screen === "editElementAttempts") {
    const editingElement =
      selectedRecord?.elements?.[editingElementIndex]

    if (!editingElement) {
      return (
        <div className="screen">
          <p>編集するエレメンツが見つかりません。</p>

          <button
            className="secondary-button"
            onClick={() => setScreen("historyDetail")}
          >
            詳細画面に戻る
          </button>
        </div>
      )
    }

    return (
      <div className="screen">
        <div className="page-header">
          <h2>練習記録を編集</h2>
          <p>
            {editingElement.category}：{editingElement.name}
          </p>
        </div>

        {editingAttempts.length === 0 && (
          <p className="empty-message">
            練習記録がありません。
          </p>
        )}

        {editingAttempts.map((attempt, index) => (
          <div className="attempt-card" key={attempt.id}>
            <div className="attempt-header">
              <strong>{index + 1}本目</strong>

              <button
                className="delete-button"
                onClick={() =>
                  deleteEditingAttempt(attempt.id)
                }
              >
                削除
              </button>
            </div>

            <div className="result-buttons">
              <button
                className={`result-button ${
                  attempt.result === "○"
                    ? "selected-good"
                    : ""
                }`}
                onClick={() =>
                  updateEditingAttempt(
                    attempt.id,
                    "result",
                    "○"
                  )
                }
              >
                <span className="result-symbol result-good-symbol">
                  ○
                </span>
              </button>

              <button
                className={`result-button ${
                  attempt.result === "△"
                    ? "selected-maybe"
                    : ""
                }`}
                onClick={() =>
                  updateEditingAttempt(
                    attempt.id,
                    "result",
                    "△"
                  )
                }
              >
                <span className="result-symbol result-maybe-symbol">
                  △
                </span>
              </button>

              <button
                className={`result-button ${
                  attempt.result === "×"
                    ? "selected-bad"
                    : ""
                }`}
                onClick={() =>
                  updateEditingAttempt(
                    attempt.id,
                    "result",
                    "×"
                  )
                }
              >
                <span className="result-symbol result-bad-symbol">
                  ×
                </span>
              </button>
            </div>

            <textarea
              value={attempt.memo}
              onChange={(e) =>
                updateEditingAttempt(
                  attempt.id,
                  "memo",
                  e.target.value
                )
              }
              placeholder="この練習についてメモ"
              rows="3"
            />
          </div>
        ))}

        <button
          className="add-attempt-button"
          onClick={addEditingAttempt}
        >
          ＋ 練習を追加
        </button>

        <button
          className="complete-button"
          onClick={() => {
            const updatedElements =
              selectedRecord.elements.map(
                (element, index) =>
                  index === editingElementIndex
                    ? {
                        ...element,
                        attempts: editingAttempts,
                      }
                    : element
              )

            const updatedRecord = {
              ...selectedRecord,
              elements: updatedElements,
            }

            setPracticeRecords((prevRecords) =>
              prevRecords.map((record) =>
                record.id === selectedRecord.id
                  ? updatedRecord
                  : record
              )
            )

            setSelectedRecord(updatedRecord)
            setEditingElementIndex(null)
            setEditingAttempts([])
            setScreen("historyDetail")
          }}
        >
          変更を保存
        </button>

        <button
          className="secondary-button"
          onClick={() => {
            setEditingElementIndex(null)
            setEditingAttempts([])
            setScreen("historyDetail")
          }}
        >
          編集をキャンセル
        </button>
      </div>
    )
  }

  // -----------------------------
  // エレメンツ情報の編集画面
  // -----------------------------
  if (screen === "editElementInfo") {
    if (editingElementInfoIndex === null) {
      return (
        <div className="screen">
          <p>編集するエレメンツが見つかりません。</p>

          <button
            className="secondary-button"
            onClick={() => setScreen("historyDetail")}
          >
            詳細画面に戻る
          </button>
        </div>
      )
    }

    return (
      <div className="screen">
        <div className="page-header">
          <h2>エレメンツを編集</h2>
          <p>カテゴリーと練習項目を変更できます。</p>
        </div>

        <div className="form-group">
          <label>カテゴリー</label>

          <select
            value={editingElementCategory}
            onChange={(e) => {
              setEditingElementCategory(e.target.value)
              setEditingElementName("")
            }}
          >
            <option value="">カテゴリーを選択</option>

            {Object.keys(elementOptions).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* ジャンプ */}
        {editingElementCategory === "ジャンプ" && (
          <div className="jump-combination-section">
            {editingJumps.map((jump, index) => (
              <div
                className="jump-select-row"
                key={index}
              >
                <div className="form-group jump-select-group">
                  <label>
                    第{index + 1}ジャンプ
                  </label>

                  <select
                    value={jump}
                    onChange={(e) => {
                      const newJumps = [...editingJumps]
                      newJumps[index] = e.target.value
                      setEditingJumps(newJumps)
                    }}
                  >
                    <option value="">
                      ジャンプを選択
                    </option>

                    {elementOptions["ジャンプ"].map((element) => (
                      <option
                        key={element}
                        value={element}
                      >
                        {element}
                      </option>
                    ))}
                  </select>
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    className="jump-delete-button"
                    onClick={() => {
                      setEditingJumps((prevJumps) =>
                        prevJumps.filter(
                          (_, jumpIndex) =>
                            jumpIndex !== index
                        )
                      )
                    }}
                  >
                    削除
                  </button>
                )}
              </div>
            ))}

            {editingJumps.length < 3 && (
              <button
                type="button"
                className="add-jump-button"
                disabled={
                  !editingJumps[
                    editingJumps.length - 1
                  ]
                }
                onClick={() => {
                  setEditingJumps((prevJumps) => [
                    ...prevJumps,
                    "",
                  ])
                }}
              >
                ＋ 第{editingJumps.length + 1}
                ジャンプを追加
              </button>
            )}
          </div>
        )}

        {/* ステップ・ターン */}
        {editingElementCategory === "ステップ・ターン" && (
          <div className="form-group">
            <label>練習項目</label>

            <input
              type="text"
              value={editingElementName}
              onChange={(e) =>
                setEditingElementName(e.target.value)
              }
              placeholder="例：右FOスリー、ダブルスリー、6ステップ"
            />
          </div>
        )}

        {editingElementCategory === "スピン" && (
          <div className="spin-input-section">
            {editingSpins.map((spin, spinIndex) => (
              <div
                className="spin-block"
                key={spinIndex}
              >
                <h3>スピン{spinIndex + 1}</h3>

                <div className="form-group">
                  <label>スピン種別</label>

                  <select
                    value={spin.type}
                    onChange={(e) => {
                      const newSpins = [...editingSpins]

                      newSpins[spinIndex] = {
                        ...newSpins[spinIndex],
                        type: e.target.value,
                        positions: [""],
                      }

                      setEditingSpins(newSpins)
                    }}
                  >
                    <option value="">
                      スピン種別を選択
                    </option>

                    {elementOptions["スピン"].map((element) => (
                      <option
                        key={element}
                        value={element}
                      >
                        {element}
                      </option>
                    ))}
                  </select>
                </div>

                {spin.positions.map((position, positionIndex) => (
                  <div
                    className="spin-position-row"
                    key={positionIndex}
                  >
                    <div className="form-group spin-position-group">
                      <label>
                        姿勢{positionIndex + 1}
                      </label>

                      <select
                        value={position}
                        onChange={(e) => {
                          const newSpins = [...editingSpins]

                          const newPositions = [
                            ...newSpins[spinIndex].positions,
                          ]

                          newPositions[positionIndex] =
                            e.target.value

                          newSpins[spinIndex] = {
                            ...newSpins[spinIndex],
                            positions: newPositions,
                          }

                          setEditingSpins(newSpins)
                        }}
                      >
                        <option value="">
                          姿勢を選択
                        </option>

                        {(spinPositionOptions[spin.type] || []).map(
                          (spinPosition) => (
                            <option
                              key={spinPosition}
                              value={spinPosition}
                            >
                              {spinPosition}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {positionIndex > 0 && (
                      <button
                        type="button"
                        className="spin-position-delete-button"
                        onClick={() => {
                          const newSpins = [...editingSpins]

                          newSpins[spinIndex] = {
                            ...newSpins[spinIndex],
                            positions:
                              newSpins[spinIndex].positions.filter(
                                (_, index) =>
                                  index !== positionIndex
                              ),
                          }

                          setEditingSpins(newSpins)
                        }}
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}

                {spin.positions.length < 4 && (
                  <button
                    type="button"
                    className="add-spin-position-button"
                    disabled={
                      !spin.type ||
                      !spin.positions[
                        spin.positions.length - 1
                      ]
                    }
                    onClick={() => {
                      const newSpins = [...editingSpins]

                      newSpins[spinIndex] = {
                        ...newSpins[spinIndex],
                        positions: [
                          ...newSpins[spinIndex].positions,
                          "",
                        ],
                      }

                      setEditingSpins(newSpins)
                    }}
                  >
                    ＋ 姿勢
                    {spin.positions.length + 1}
                    を追加
                  </button>
                )}

                {spinIndex > 0 && (
                  <button
                    type="button"
                    className="spin-position-delete-button"
                    onClick={() => {
                      setEditingSpins((prevSpins) =>
                        prevSpins.filter(
                          (_, index) => index !== spinIndex
                        )
                      )
                    }}
                  >
                    このスピンを削除
                  </button>
                )}
              </div>
            ))}

            {editingSpins.length < 4 && (
              <button
                type="button"
                className="add-spin-position-button"
                disabled={
                  editingSpins.length === 0 ||
                  !editingSpins[
                    editingSpins.length - 1
                  ].type ||
                  editingSpins[
                    editingSpins.length - 1
                  ].positions.some(
                    (position) => position === ""
                  )
                }
                onClick={() => {
                  setEditingSpins((prevSpins) => [
                    ...prevSpins,
                    {
                      type: "",
                      positions: [""],
                    },
                  ])
                }}
              >
                ＋ スピン
                {editingSpins.length + 1}
                を追加
              </button>
            )}
          </div>
        )}

        <button
          className="complete-button"
          disabled={
            editingElementCategory === "ジャンプ"
              ? editingJumps.length === 0 ||
                editingJumps.some((jump) => jump === "")
              : editingElementCategory === "スピン"
              ? editingSpins.length === 0 ||
                editingSpins.some(
                  (spin) =>
                    !spin.type ||
                    spin.positions.length === 0 ||
                    spin.positions.some(
                      (position) => position === ""
                    )
                )
              : !editingElementName
          }
          onClick={() => {
            const updatedElements =
              selectedRecord.elements.map(
                (element, index) => {
                  if (index !== editingElementInfoIndex) {
                    return element
                  }

                  if (editingElementCategory === "ジャンプ") {
                    const newJumpName =
                      editingJumps.filter(Boolean).join("+")

                    return {
                      ...element,
                      category: "ジャンプ",
                      name: newJumpName,
                      jumps: editingJumps.map((jump) => ({
                        name: jump,
                      })),
                    }
                  }

                  if (editingElementCategory === "スピン") {
                    const newSpinName = editingSpins
                      .map((spin) => {
                        const positionsText = spin.positions
                          .filter(Boolean)
                          .join("→")

                        if (!spin.type) {
                          return ""
                        }

                        if (!positionsText) {
                          return spin.type
                        }

                        return `${spin.type}（${positionsText}）`
                      })
                      .filter(Boolean)
                      .join("→")

                    return {
                      ...element,
                      category: "スピン",
                      name: newSpinName,
                      spins: editingSpins.map((spin) => ({
                        type: spin.type,
                        positions: [...spin.positions],
                      })),
                    }
                  }

                  return {
                    ...element,
                    category: editingElementCategory,
                    name: editingElementName,
                  }
                }
              )

            const updatedRecord = {
              ...selectedRecord,
              elements: updatedElements,
            }

            setPracticeRecords((prevRecords) =>
              prevRecords.map((record) =>
                record.id === selectedRecord.id
                  ? updatedRecord
                  : record
              )
            )

            setSelectedRecord(updatedRecord)

            setEditingElementInfoIndex(null)
            setEditingElementCategory("")
            setEditingElementName("")
            setEditingSpins([])
            setEditingJumps([""])
            setScreen("historyDetail")
          }}
        >
          変更を保存
        </button>

        <button
          className="secondary-button"
          onClick={() => {
            setEditingElementInfoIndex(null)
            setEditingElementCategory("")
            setEditingElementName("")
            setEditingSpins([])
            setEditingJumps([""])
            setScreen("historyDetail")
          }}
        >
          編集をキャンセル
        </button>
      </div>
    )
  }

  // -----------------------------
  // セッション保存完了画面
  // -----------------------------
  if (screen === "sessionComplete") {
    return (
      <div className="screen">
        <div className="page-header">
          <h2>セッションを保存しました！</h2>
          <p>次に何をしますか？</p>
        </div>

        <div className="complete-options">
          <button
            className="main-button"
            onClick={() => {
              setPracticeType("自主練")
              setGoal("")
              setSessionDuration("")
              setCoachAdvice("")
              setAccomplishments("")
              setNextTask("")
              setFreeMemo("")

              setSelectedCategory("")
              setSelectedElement("")
              setSelectedElements([])
              setAttempts([])

              setScreen("record")
            }}
          >
            ＋ 次のセッションを記録
          </button>

          <button
            className="secondary-button"
            onClick={() => {
              setPracticeType("自主練")
              setGoal("")
              setSessionDuration("")
              setCoachAdvice("")
              setAccomplishments("")
              setNextTask("")
              setFreeMemo("")

              setSelectedCategory("")
              setSelectedElement("")
              setSelectedElements([])
              setAttempts([])

              setScreen("home")
            }}
          >
            今日の練習を終了
          </button>
        </div>
      </div>
    )
  }

  // -----------------------------
  // 設定画面
  // -----------------------------
  if (screen === "settings") {
    return (
      <div className="screen">
        <div className="page-header">
          <h2>設定</h2>
          <p>バックアップやデータ出力ができます。</p>
        </div>

        <div className="settings-section">
          <h3>バックアップ</h3>

          <p className="settings-description">
            JSONバックアップは、練習記録を復元するために使います。
          </p>

          <button
            className="main-button"
            onClick={exportBackupJson}
          >
            JSONバックアップを書き出す
          </button>

          <label className="import-button">
            JSONバックアップから復元
            <input
              type="file"
              accept=".json,application/json"
              onChange={importBackupJson}
            />
          </label>
        </div>

        <div className="settings-section">
          <h3>CSV出力</h3>

          <p className="settings-description">
            Excelなどで練習記録を確認・集計するためのファイルを書き出します。
          </p>

          <button
            className="secondary-button"
            onClick={exportRecordsCsv}
          >
            CSVを書き出す
          </button>
        </div>

        <button
          className="secondary-button"
          onClick={() => setScreen("home")}
        >
          ホームに戻る
        </button>
      </div>
    )
  }

  // -----------------------------
  // 日別練習履歴画面
  // -----------------------------
  if (screen === "historyDay") {
    const selectedDateRecords = selectedHistoryDate
      ? [...practiceRecords]
          .filter(
            (record) =>
              record.date === selectedHistoryDate
          )
          .sort((a, b) => a.id - b.id)
      : []

    return (
      <div className="screen">
        <div className="page-header">
          <h2>練習履歴</h2>
          <p>{selectedHistoryDate}</p>
        </div>

        {selectedDateRecords.length === 0 ? (
          <div className="empty-message">
            <p>この日の練習記録はありません。</p>
          </div>
        ) : (
          <div className="history-day-sessions">
            {selectedDateRecords.map((record) => {
              const sameTypeRecords =
                selectedDateRecords.filter(
                  (item) =>
                    item.type === record.type
                )

              const typeIndex =
                sameTypeRecords.findIndex(
                  (item) =>
                    item.id === record.id
                )

              return (
                <div
                  className="history-card"
                  key={record.id}
                  onClick={() => {
                    setSelectedRecord(record)
                    setScreen("historyDetail")
                  }}
                >
                  <div className="history-card-header">
                    <h3>
                      {record.type}

                      {sameTypeRecords.length > 1
                        ? ` ${typeIndex + 1}`
                        : ""}
                    </h3>

                    <span className="practice-type">
                      {record.duration
                        ? `${record.duration}分`
                        : "時間未入力"}
                    </span>
                  </div>

                  {record.goal && (
                    <div className="history-section">
                      <h4>今日の目標</h4>
                      <p>{record.goal}</p>
                    </div>
                  )}

                  {record.accomplishments && (
                    <div className="history-section">
                      <h4>今日できたこと</h4>
                      <p>
                        {record.accomplishments}
                      </p>
                    </div>
                  )}

                  {record.nextTask && (
                    <div className="history-section">
                      <h4>次回の課題</h4>
                      <p>{record.nextTask}</p>
                    </div>
                  )}

                  {record.coachAdvice && (
                    <div className="history-section">
                      <h4>
                        コーチからのアドバイス
                      </h4>
                      <p>{record.coachAdvice}</p>
                    </div>
                  )}

                  {record.freeMemo && (
                    <div className="history-section">
                      <h4>自由メモ</h4>
                      <p>{record.freeMemo}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <button
          className="secondary-button"
          onClick={() => setScreen("history")}
        >
          カレンダーに戻る
        </button>
      </div>
    )
  }

  return null
}

export default App

