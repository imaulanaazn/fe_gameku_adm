"use client";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface ArticleComment {
  content: string;
  createdAt: string;
  email: string;
  name: string;
}

const initialComment = {
  name: "",
  email: "",
  content: "",
  createdAt: "",
};

export default function CommentSection({ articleId }: { articleId: string }) {
  const [articleComments, setArticleComments] = useState<ArticleComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentFormData, setCommentFormData] = useState(initialComment);

  useEffect(() => {
    async function getArticles() {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/v1/article-comment/${articleId}`,
          {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const data = await response.json();

        const comments = data.data.reverse();

        setArticleComments(comments);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getArticles();
  }, []);

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      articleId: articleId,
      name: commentFormData.name,
      email: commentFormData.email,
      content: commentFormData.content,
    };

    try {
      const response = await fetch(`${BASE_URL}/v1/article-comment`, {
        cache: "no-cache",
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const date = new Date();

      setArticleComments((prev) => {
        return [
          ...prev,
          {
            name: commentFormData.name,
            email: commentFormData.email,
            content: commentFormData.content,
            createdAt: date.toISOString(),
          },
        ];
      });

      setCommentFormData(initialComment);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="comment-section">
      <div className="bg-white overflow-hidden">
        <div className="py-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {articleComments.length} Comments
          </h2>
          <ul className="mt-6 space-y-4">
            {articleComments.map((comment) => (
              <li key={comment.createdAt} className="flex">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-slate-200 shrink-0">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-gray-500 text-xl"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-bold text-gray-700">
                    {comment.name}
                    <span className="block text-xs font-normal text-gray-500">
                      {dayjs(comment.createdAt).format("DD-MM-YYYY")}
                    </span>
                  </h4>
                  <p className="text-base text-gray-600 mt-2">
                    {comment.content}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white overflow-hidden">
        <div className="py-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Your comment
          </h2>
          <form
            id="comment"
            action="#"
            onSubmit={postComment}
            method="post"
            className="mt-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                type="text"
                id="name"
                value={commentFormData.name}
                onChange={(e) => {
                  setCommentFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
                placeholder="Your name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                name="email"
                type="email"
                id="email"
                value={commentFormData.email}
                onChange={(e) => {
                  setCommentFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
                placeholder="Your email"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <textarea
              name="message"
              rows={6}
              id="message"
              value={commentFormData.content}
              onChange={(e) => {
                setCommentFormData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }));
              }}
              placeholder="Type your comment"
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
            <button
              type="submit"
              id="form-submit"
              className="inline-block px-6 py-2 bg-primary-900 text-white font-medium rounded hover:bg-red-600"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
