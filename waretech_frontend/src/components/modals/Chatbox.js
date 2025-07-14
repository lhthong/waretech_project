import {
  MainContainer,
  ChatContainer,
  MessageList,
  TypingIndicator,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { useState, useEffect } from "react";
import { XIcon, UserIcon, BotIcon, SparklesIcon } from "lucide-react";
import { ChatbotQuestion, getAllFaqs } from "../../services/FaqApi";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Xin chào! Bạn cần hỗ trợ gì không?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]); // State để lưu câu hỏi gợi ý

  // Lấy danh sách FAQ khi mở chatbox
  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      const fetchSuggestions = async () => {
        try {
          console.log("Gọi API getAllFaqs...");
          const response = await getAllFaqs({ status: "true" });
          console.log("Phản hồi từ API:", response);
          const faqs = response.data;
          if (!Array.isArray(faqs)) {
            console.error("Dữ liệu trả về không phải là mảng:", faqs);
            throw new Error("Dữ liệu không hợp lệ");
          }
          const questions = faqs
            .filter((faq) => faq.status === true)
            .slice(0, 3)
            .map((faq) => faq.question);
          console.log("Câu hỏi gợi ý sau khi lọc:", questions);
          if (isMounted) setSuggestedQuestions(questions);
        } catch (error) {
          console.error("Lỗi khi lấy câu hỏi gợi ý:", error);
          if (isMounted) {
            setSuggestedQuestions([]);
            console.log(
              "Không thể lấy câu hỏi gợi ý, để suggestedQuestions rỗng."
            );
          }
        }
      };
      fetchSuggestions();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Xử lý khi nhấp vào gợi ý
  const handleSuggestionClick = async (question) => {
    const newMessage = {
      message: question,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const res = await ChatbotQuestion(question);
      console.log("Phản hồi từ API:", res);
      setMessages((prev) => [
        ...prev,
        {
          message:
            res.answer ||
            "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Lỗi API:", error);
      setMessages((prev) => [
        ...prev,
        {
          message: "Hệ thống đang gặp lỗi, vui lòng thử lại sau.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (userInput) => {
    if (!userInput.trim()) return;

    const newMessage = {
      message: userInput,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const res = await ChatbotQuestion(userInput);
      console.log("Phản hồi từ API:", res);
      setMessages((prev) => [
        ...prev,
        {
          message:
            res.answer ||
            "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Lỗi API:", error);
      setMessages((prev) => [
        ...prev,
        {
          message: "Hệ thống đang gặp lỗi, vui lòng thử lại sau.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Format thời gian
  const formatTimestamp = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-5 right-4 w-[400px] z-50 shadow-lg border border-gray-200 rounded-2xl overflow-hidden bg-white animate-slide-up transition-all duration-300 ">
          <div
            className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
          >
            <span className="font-semibold text-lg flex items-center gap-2">
              <SparklesIcon size={20} className="text-orange-300" /> Hỗ trợ
              khách hàng
            </span>

            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-red-200 transition-colors duration-200"
            >
              <XIcon size={20} />
            </button>
          </div>

          <div style={{ height: "450px" }}>
            <MainContainer>
              <ChatContainer>
                <MessageList
                  typingIndicator={
                    isTyping && <TypingIndicator content="Đang trả lời..." />
                  }
                  key={suggestedQuestions.length}
                  className="p-4"
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-end gap-2 mb-4 ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.sender === "bot" && (
                        <BotIcon size={20} className="text-indigo-500" />
                      )}
                      <div
                        className={`max-w-[75%] p-3 rounded-xl shadow-sm ${
                          msg.sender === "user"
                            ? "bg-blue-100 text-blue-900 animate-slide-in"
                            : "bg-gray-200 text-gray-900 animate-slide-in-left"
                        }`}
                      >
                        <p className="text-base">{msg.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                      {msg.sender === "user" && (
                        <UserIcon size={20} className="text-blue-500" />
                      )}
                    </div>
                  ))}
                  {messages.length === 1 && suggestedQuestions.length > 0 && (
                    <div className="mt-4 px-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-400 text-sm font-medium mb-2">
                          Gợi ý cho bạn:
                        </p>
                        <ul className="space-y-2">
                          {suggestedQuestions.map((question, qIndex) => (
                            <li
                              key={qIndex}
                              onClick={() => handleSuggestionClick(question)}
                              className="flex items-center gap-2 text-indigo-600 hover:text-orange-600 font-medium text-base cursor-pointer transition-all duration-200 hover:bg-indigo-50 rounded-md p-2"
                            >
                              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </MessageList>
                <MessageInput
                  placeholder="Nhập câu hỏi của bạn..."
                  onSend={handleSend}
                  attachButton={false}
                  className="border-t border-gray-200 "
                  inputStyle={{ padding: "12px", fontSize: "14px" }}
                />
              </ChatContainer>
            </MainContainer>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-16 right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-full shadow-lg z-50 animate-bounce transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl"
        >
          <SparklesIcon size={24} className="text-orange-300" />
        </button>
      )}
    </>
  );
};

export default Chatbox;
