import { useState } from "react";
import { LOCAL_API_PROXY, GLOBAL_API_PROXY } from "../../config.js";
import "./style.css";
import axios from "axios";

export default function StickyNote(props) {
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);
  const [color, setColor] = useState(props.color);
  const [isColorSelect, setIsColorSelect] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  function onEditPush(type, value) {
    axios
      .put(
        `${GLOBAL_API_PROXY}/updateNote`,
        {
          id: props.id,
          title: type === "title" ? value : title,
          content: type === "content" ? value : content,
          color: type === "color" ? value : color,
          userId: props.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        // window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleColorChange(colorToSet) {
    setColor(colorToSet);
    onEditPush("color", colorToSet);
  }

  return (
    <>
      {!isDeleted && (
        <div
          className="note p-4 rounded-md"
          style={{ backgroundColor: `${color}` }}
        >
          <div className="w-100 flex flex-row justify-between mb-4">
            <input
              type="text"
              className="bg-transparent outline-none"
              placeholder="Note Title"
              defaultValue={title}
              onChange={(e) => {
                setTitle(e.target.value);
                onEditPush("title", e.target.value);
              }}
            />
            <div
              className="cursor-pointer"
              onClick={(e) => {
                axios
                  .delete(`${GLOBAL_API_PROXY}/deleteNote`, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                    data: {
                      noteId: props.id,
                    },
                  })
                  .then((response) => {
                    setIsDeleted(true);
                    // window.location.reload();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }}
            >
              <i class="fa-solid fa-trash" style={{ color: "#ff0000" }}></i>
            </div>
          </div>
          <textarea
            className="bg-transparent outline-none w-full overflow-hidden resize-none"
            placeholder="Note Content"
            rows={9}
            maxLength={250}
            defaultValue={content}
            onChange={(e) => {
              setContent(e.target.value);
              onEditPush("content", e.target.value);
            }}
          />
          <div className="mt-4 rounded-md">
            {!isColorSelect ? (
              <div
                onClick={() => setIsColorSelect(true)}
                className="cursor-pointer w-8 h-8 flex justify-center items-center rounded-xl"
                style={{ backgroundColor: color, filter: "brightness(90%)" }}
              >
                {"➡️"}
              </div>
            ) : (
              <div className="flex flex-row justify-around">
                <div
                  className="w-8 h-8 border-2 border-red-500"
                  onClick={() => {
                    handleColorChange("#ffcccc");
                    setIsColorSelect(false);
                  }}
                  style={{ backgroundColor: "#ffcccc" }}
                ></div>
                <div
                  className="w-8 h-8 border-2 border-green-500"
                  onClick={() => {
                    handleColorChange("#ccffcc");
                    setIsColorSelect(false);
                  }}
                  style={{ backgroundColor: "#ccffcc" }}
                ></div>
                <div
                  className="w-8 h-8 border-2 border-blue-500"
                  onClick={() => {
                    handleColorChange("#ccccff");
                    setIsColorSelect(false);
                  }}
                  style={{ backgroundColor: "#ccccff" }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
