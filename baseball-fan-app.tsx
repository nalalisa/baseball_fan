"use client"

import React from "react"

import { useState } from "react"
import { Home, Target, BookOpen, User, Trophy, Brain, Bell, Calendar, Clock, Star, MessageCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Post {
  id: number
  title: string
  content: string
  author: string
  date: string
  likes: number
  comments: number
  type: "text" | "poll" | "photo" | "rumor" | "diary"
  category: string
  isPopular?: boolean
  isHot?: boolean
  isMine?: boolean
  pollOptions?: string[]
  pollResults?: number[]
  totalVotes?: number
  image?: boolean
  authorAvatar?: string
  authorBadge?: string
}

// 라이브 예측 페이지 컴포넌트
function LivePredictionPage({ onClose }: { onClose: () => void }) {
  const [activeMode, setActiveMode] = useState<"prediction" | "quiz">("prediction")
  const [timeLeft, setTimeLeft] = useState(15)
  const [currentSituation, setCurrentSituation] = useState("batter")
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null)
  const [selectedSubPrediction, setSelectedSubPrediction] = useState<string | null>(null)
  const [quizQuestion, setQuizQuestion] = useState<string | null>(null)
  const [participants, setParticipants] = useState(1234)
  const [dailyPredictions, setDailyPredictions] = useState(2)
  const [showSuccessEffect, setShowSuccessEffect] = useState(false)
  const [showPointsMessage, setShowPointsMessage] = useState(false)

  // 타이머 효과
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // 실시간 상황 시뮬레이션
  const situations = {
    batter: {
      title: "🏏 김현수 타석 예측",
      predictions: ["안타", "삼진", "사사구", "희생타"],
      subPredictions: {
        title: "투구 예측:",
        options: ["직구", "커브", "슬라이더", "포크볼", "체인지업"],
      },
    },
    pitch: {
      title: "⚾ 투구 결과 예측",
      predictions: ["스트라이크", "볼", "파울", "스윙앤미스"],
      subPredictions: {
        title: "구종 예측:",
        options: ["직구", "커브", "슬라이더", "포크볼", "체인지업"],
      },
    },
    steal: {
      title: "🏃‍♂️ 도루 시도 예측",
      predictions: ["도루 성공", "도루 실패", "견제 아웃", "시도 안함"],
      subPredictions: {
        title: "베이스:",
        options: ["2루", "3루", "홈"],
      },
    },
  }

  const quizzes = [
    "다음 타자는 누구일까요?",
    "현재 투수의 구속은?",
    "이번 이닝 득점 예상은?",
    "다음 교체될 선수는?",
    "현재 볼카운트는?",
  ]

  const currentSit = situations[currentSituation as keyof typeof situations]

  const handlePredictionSubmit = () => {
    if (selectedPrediction && dailyPredictions > 0) {
      setTimeLeft(0)
      setDailyPredictions(dailyPredictions - 1)
      
      // 모든 예측에 대해 성공 이펙트 표시
      setShowSuccessEffect(true)
      setShowPointsMessage(true)
      
      // 3초 후 이펙트와 메시지 숨기기
      setTimeout(() => {
        setShowSuccessEffect(false)
        setShowPointsMessage(false)
      }, 3000)

      // 3초 후 다음 상황으로 변경
      setTimeout(() => {
        setTimeLeft(15)
        setSelectedPrediction(null)
        setSelectedSubPrediction(null)
        const situationKeys = Object.keys(situations)
        const currentIndex = situationKeys.indexOf(currentSituation)
        const nextIndex = (currentIndex + 1) % situationKeys.length
        setCurrentSituation(situationKeys[nextIndex])
      }, 3000)
    }
  }

  const handleQuizAnswer = (answer: string) => {
    // 퀴즈 답변 로직
    setQuizQuestion(null)
    setTimeout(() => {
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)]
      setQuizQuestion(randomQuiz)
    }, 5000)
  }

  // 퀴즈 랜덤 생성
  React.useEffect(() => {
    if (activeMode === "quiz" && !quizQuestion) {
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)]
      setQuizQuestion(randomQuiz)
    }
  }, [activeMode])

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose}>
          ← 뒤로
        </Button>
        <h2 className="text-lg font-bold">🔴 라이브 게임</h2>
        <div></div>
      </div>

      {/* 경기 정보 */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="font-bold">LG</div>
                <div className="text-2xl font-bold text-blue-600">7</div>
              </div>
              <div className="text-gray-500">vs</div>
              <div className="text-center">
                <div className="font-bold">KT</div>
                <div className="text-2xl font-bold text-red-600">5</div>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="destructive">LIVE</Badge>
              <div className="text-sm text-gray-600">9회말 2아웃</div>
            </div>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>🏟️ 잠실야구장 | 주자: 1,3루</div>
            <div>🏏 타자: 김현수 (0B-2S) | ⚾ 투수: 박세웅 (87구)</div>
          </div>
        </CardContent>
      </Card>

      {/* 모드 선택 */}
      <div className="flex gap-2">
        <Button
          variant={activeMode === "prediction" ? "default" : "outline"}
          onClick={() => setActiveMode("prediction")}
          className="flex-1"
        >
          🎯 예측
        </Button>
        <Button
          variant={activeMode === "quiz" ? "default" : "outline"}
          onClick={() => setActiveMode("quiz")}
          className="flex-1"
        >
          🧠 퀴즈
        </Button>
      </div>
      <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <span className="text-yellow-500">🎯</span>
                    <span>남은 예측 기회</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          i < dailyPredictions ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {i < dailyPredictions ? "🎯" : ""}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
      {activeMode === "prediction" && (
        <div className="relative">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{currentSit.title}</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-red-500 font-bold">{timeLeft}초</div>
                  <Progress value={(timeLeft / 15) * 100} className="w-16 h-2" />
                </div>
              </div>

              {/* 메인 예측 */}
              <div>
                <div className="text-sm text-gray-600 mb-2">결과 예측:</div>
                <div className="grid grid-cols-2 gap-2">
                  {currentSit.predictions.map((option) => (
                    <Button
                      key={option}
                      size="sm"
                      variant={selectedPrediction === option ? "default" : "outline"}
                      onClick={() => setSelectedPrediction(option)}
                      disabled={timeLeft === 0 || dailyPredictions <= 0}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 서브 예측 */}
              <div>
                <div className="text-sm text-gray-600 mb-2">{currentSit.subPredictions.title}</div>
                <div className="grid grid-cols-3 gap-2">
                  {currentSit.subPredictions.options.slice(0, 3).map((option) => (
                    <Button
                      key={option}
                      size="sm"
                      variant={selectedSubPrediction === option ? "default" : "outline"}
                      className="text-xs"
                      onClick={() => setSelectedSubPrediction(option)}
                      disabled={timeLeft === 0 || dailyPredictions <= 0}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                {currentSit.subPredictions.options.length > 3 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {currentSit.subPredictions.options.slice(3).map((option) => (
                      <Button
                        key={option}
                        size="sm"
                        variant={selectedSubPrediction === option ? "default" : "outline"}
                        className="text-xs"
                        onClick={() => setSelectedSubPrediction(option)}
                        disabled={timeLeft === 0 || dailyPredictions <= 0}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {selectedPrediction && timeLeft > 0 && (
                <Button className="w-full" size="sm" onClick={handlePredictionSubmit} disabled={dailyPredictions <= 0}>
                  예측 제출하기
                </Button>
              )}

              <div className="space-y-2">
                <div className="text-xs text-center text-gray-500">
                  참여자 {participants.toLocaleString()}명 | 보상: 50P
                </div>

                
              </div>
            </CardContent>
          </Card>

          {/* 성공 이펙트 */}
          {showSuccessEffect && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
              <div className="animate-bounce text-6xl">✨</div>
              <div className="animate-pulse text-6xl">🎯</div>
              <div className="animate-spin text-6xl">⭐</div>
            </div>
          )}

          {/* 포인트 획득 메시지 */}
          {showPointsMessage && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 shadow-lg z-50 animate-fade-in">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">🎉 예측 성공!</div>
                <div className="text-lg text-yellow-700">+50 포인트 획득!</div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeMode === "quiz" && (
        <Card>
          <CardContent className="p-4">
            {quizQuestion ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">🧠 {quizQuestion}</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleQuizAnswer("A")}>
                    선택지 A
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleQuizAnswer("B")}>
                    선택지 B
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleQuizAnswer("C")}>
                    선택지 C
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleQuizAnswer("D")}>
                    선택지 D
                  </Button>
                </div>
                <div className="text-xs text-center text-gray-500">제한시간: 10초 | 보상: 30P</div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500 mb-2">다음 퀴즈를 기다리는 중...</div>
                <div className="text-xs text-gray-400">
                  • 이닝 교체 시<br />• 투수 교체 시<br />• 특정 선수 타석 시<br />• 랜덤 타이밍
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// 홈 페이지 컴포넌트
function HomePage() {
  const [selectedLiveGame, setSelectedLiveGame] = useState<number | null>(null)
  const [showLivePrediction, setShowLivePrediction] = useState(false)

  if (showLivePrediction) {
    return <LivePredictionPage onClose={() => setShowLivePrediction(false)} />
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg">
        <div>
          <h1 className="text-xl font-bold">⚾ FAN:LY</h1>
          <p className="text-sm opacity-90">오늘도 야구보기 좋은 날!</p>
        </div>
        <Bell className="w-6 h-6" />
      </div>

      {/* 실시간 경기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            실시간 경기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-bold">LG</div>
                    <div className="text-2xl font-bold text-blue-600">7</div>
                  </div>
                  <div className="text-gray-500">vs</div>
                  <div className="text-center">
                    <div className="font-bold">KT</div>
                    <div className="text-2xl font-bold text-red-600">5</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="destructive">LIVE</Badge>
                  <div className="text-sm text-gray-600">9회말</div>
                </div>
              </div>

              {/* 라이브 게임 참여 버튼 */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowLivePrediction(true)} className="flex-1">
                  🎯 라이브 예측
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  🧠 실시간 퀴즈
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 오늘의 경기 일정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            오늘의 경기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { home: "SSG", away: "두산", time: "18:30", status: "예정" },
              { home: "키움", away: "NC", time: "18:30", status: "예정" },
              { home: "롯데", away: "한화", time: "18:30", status: "예정" },
            ].map((game, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{game.away}</span>
                  <span className="text-gray-500">@</span>
                  <span className="font-medium">{game.home}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{game.time}</div>
                  <Badge variant="outline">{game.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 빠른 메뉴 */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 메뉴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: Target, label: "예측게임", color: "text-red-500" },
              { icon: BookOpen, label: "직관일기", color: "text-blue-500" },
              { icon: Trophy, label: "팬랭킹", color: "text-yellow-500" },
              { icon: Brain, label: "POP퀴즈", color: "text-purple-500" },
            ].map((menu, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <menu.icon className={`w-6 h-6 ${menu.color}`} />
                </div>
                <div className="text-xs font-medium">{menu.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 예측게임 페이지 컴포넌트
function PredictionPage() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null)
  const [prediction, setPrediction] = useState<string>("")
  const [betPoints, setBetPoints] = useState<number>(100)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🎯 예측게임</h2>
        <div className="text-sm">
          <span className="text-gray-600">보유 포인트: </span>
          <span className="font-bold text-blue-600">1,250P</span>
        </div>
      </div>

      {/* 3 Prediction Limit 메시지 */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="text-yellow-600">⚠️</div>
            <div className="text-sm font-medium text-yellow-800">3 Prediction Limit</div>
          </div>
          <div className="text-xs text-yellow-700 mt-1">일일 예측 제한: 3회 (남은 횟수: 2회)</div>
        </CardContent>
      </Card>

      {/* 예측 가능한 경기 목록 */}
      <div className="space-y-3">
        {[
          { id: 1, home: "SSG", away: "두산", time: "18:30", odds: { home: 1.8, away: 2.1 } },
          { id: 2, home: "키움", away: "NC", time: "18:30", odds: { home: 2.3, away: 1.6 } },
          { id: 3, home: "롯데", away: "한화", time: "18:30", odds: { home: 1.9, away: 1.9 } },
        ].map((game) => (
          <Card key={game.id} className={selectedGame === game.id ? "ring-2 ring-blue-500" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold">{game.away}</span>
                  <span className="text-gray-500">@</span>
                  <span className="font-bold">{game.home}</span>
                </div>
                <div className="text-sm text-gray-600">{game.time}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedGame === game.id && prediction === "away" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedGame(game.id)
                    setPrediction("away")
                  }}
                  className="text-sm"
                >
                  {game.away} 승리 ({game.odds.away})
                </Button>
                <Button
                  variant={selectedGame === game.id && prediction === "home" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedGame(game.id)
                    setPrediction("home")
                  }}
                  className="text-sm"
                >
                  {game.home} 승리 ({game.odds.home})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 배팅 섹션 */}
      {selectedGame && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">배팅하기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>배팅 포인트</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={betPoints}
                  onChange={(e) => setBetPoints(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">P</span>
              </div>
            </div>
            <div className="flex gap-2">
              {[100, 300, 500, 1000].map((points) => (
                <Button key={points} variant="outline" size="sm" onClick={() => setBetPoints(points)}>
                  {points}P
                </Button>
              ))}
            </div>
            <Button className="w-full" size="lg">
              예측 참여하기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// 직관일기 페이지 컴포넌트
function DiaryPage() {
  const [activeTab, setActiveTab] = useState("list") // "list", "write", "stats"
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showComments, setShowComments] = useState<number | null>(null)
  const [newComment, setNewComment] = useState("")
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

  const [formData, setFormData] = useState({
    date: "",
    homeTeam: "",
    awayTeam: "",
    result: "",
    weather: "",
    mood: "",
    seat: "",
    companion: "",
    score: "",
    mvp: "",
    title: "",
    content: "",
  })

  // 직관일기 예시 데이터 (자신의 글만)
  const myDiaryPosts = [
    {
      id: 1,
      author: "야구팬123",
      title: "잠실에서의 짜릿한 역전승!",
      date: "2024.01.15",
      homeTeam: "LG",
      awayTeam: "KT",
      result: "win",
      weather: "sunny",
      mood: "excited",
      score: "7-5",
      seat: "1루 응원석",
      companion: "friends",
      mvp: "김현수",
      content:
        "9회말 투아웃에서 터진 끝내기 홈런! 정말 소름돋는 경기였어요. 친구들과 함께 응원하며 목이 쉴 정도로 소리쳤는데, 마지막에 김현수 선수가 홈런을 치는 순간 온 구장이 들썩였습니다. 이런 순간이 있어서 야구장에 오는 것 같아요!",
      likes: 124,
      comments: 18,
      photos: 3,
      isMine: true,
    },
    {
      id: 4,
      author: "야구팬123",
      title: "추운 날씨에도 열정적인 응원",
      date: "2024.01.08",
      homeTeam: "한화",
      awayTeam: "롯데",
      result: "draw",
      weather: "windy",
      mood: "nervous",
      score: "2-2",
      seat: "3루 응원석",
      companion: "colleagues",
      mvp: "노시환",
      content:
        "회사 동료들과 함께 간 첫 야구 관람이었어요. 바람이 많이 불어서 추웠지만, 동료들과 함께 응원하며 즐거운 시간을 보냈습니다. 무승부로 끝났지만 박진감 넘치는 경기였어요!",
      likes: 45,
      comments: 8,
      photos: 1,
      isMine: true,
    },
  ]

  // 댓글 데이터
  const [comments, setComments] = useState<
    Record<
      number,
      Array<{
        id: number
        author: string
        content: string
        time: string
        likes: number
      }>
    >
  >({
    1: [
      {
        id: 1,
        author: "야구매니아",
        content: "정말 짜릿한 경기였겠네요! 저도 그 순간 봤는데 소름돋았어요 ⚾",
        time: "2시간 전",
        likes: 5,
      },
      {
        id: 2,
        author: "직관러버",
        content: "끝내기 홈런은 정말 최고죠! 부럽습니다 👏",
        time: "1시간 전",
        likes: 3,
      },
    ],
    4: [
      {
        id: 3,
        author: "야구팬456",
        content: "동료들과 함께 가는 야구 관람도 재미있겠네요!",
        time: "3시간 전",
        likes: 2,
      },
    ],
  })

  // 내 직관일기 통계
  const myStats = {
    totalGames: 15,
    wins: 8,
    losses: 6,
    draws: 1,
    winRate: 53.3,
    favoriteTeam: "LG",
    favoriteStadium: "잠실야구장",
    totalPhotos: 45,
    totalLikes: 234,
    mostVisitedWith: "친구들",
    weatherStats: {
      sunny: 8,
      cloudy: 4,
      rainy: 2,
      windy: 1,
    },
    moodStats: {
      excited: 6,
      happy: 5,
      nervous: 3,
      sad: 1,
    },
  }

  const handleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts)
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    setLikedPosts(newLikedPosts)
  }

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      author: "야구팬123",
      content: newComment,
      time: "방금 전",
      likes: 0,
    }

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment],
    }))
    setNewComment("")
  }

  // 검색 필터링
  const filteredPosts = myDiaryPosts.filter((post) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.homeTeam.toLowerCase().includes(query) ||
      post.awayTeam.toLowerCase().includes(query) ||
      post.mvp.toLowerCase().includes(query)
    )
  })

  // 직관일기 작성 폼
  if (showCreatePost) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setShowCreatePost(false)}>
            ← 뒤로
          </Button>
          <h2 className="text-lg font-bold">📝 직관일기 작성</h2>
          <div></div>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            {/* 경기 정보 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>날짜</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>경기 결과</Label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="win">승리</option>
                  <option value="lose">패배</option>
                  <option value="draw">무승부</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>홈팀</Label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={formData.homeTeam}
                  onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="LG">LG 트윈스</option>
                  <option value="KT">KT 위즈</option>
                  <option value="SSG">SSG 랜더스</option>
                  <option value="키움">키움 히어로즈</option>
                  <option value="두산">두산 베어스</option>
                  <option value="KIA">KIA 타이거즈</option>
                  <option value="롯데">롯데 자이언츠</option>
                  <option value="삼성">삼성 라이온즈</option>
                  <option value="NC">NC 다이노스</option>
                  <option value="한화">한화 이글스</option>
                </select>
              </div>
              <div>
                <Label>원정팀</Label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={formData.awayTeam}
                  onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="LG">LG 트윈스</option>
                  <option value="KT">KT 위즈</option>
                  <option value="SSG">SSG 랜더스</option>
                  <option value="키움">키움 히어로즈</option>
                  <option value="두산">두산 베어스</option>
                  <option value="KIA">KIA 타이거즈</option>
                  <option value="롯데">롯데 자이언츠</option>
                  <option value="삼성">삼성 라이온즈</option>
                  <option value="NC">NC 다이노스</option>
                  <option value="한화">한화 이글스</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>최종 스코어</Label>
                <Input
                  placeholder="예: 7-5"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>MVP</Label>
                <Input
                  placeholder="오늘의 MVP"
                  value={formData.mvp}
                  onChange={(e) => setFormData({ ...formData, mvp: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            {/* 관람 정보 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>날씨</Label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={formData.weather}
                  onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="sunny">☀️ 맑음</option>
                  <option value="cloudy">☁️ 흐림</option>
                  <option value="rainy">🌧️ 비</option>
                  <option value="windy">💨 바람</option>
                </select>
              </div>
              <div>
                <Label>기분</Label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="excited">😆 신남</option>
                  <option value="happy">😊 기쁨</option>
                  <option value="sad">😢 슬픔</option>
                  <option value="angry">😠 화남</option>
                  <option value="nervous">😰 긴장</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>좌석</Label>
                <Input
                  placeholder="예: 1루 응원석"
                  value={formData.seat}
                  onChange={(e) => setFormData({ ...formData, seat: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>동행인</Label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={formData.companion}
                  onChange={(e) => setFormData({ ...formData, companion: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="alone">혼자</option>
                  <option value="friends">친구들과</option>
                  <option value="family">가족과</option>
                  <option value="couple">연인과</option>
                  <option value="colleagues">동료들과</option>
                </select>
              </div>
            </div>

            {/* 제목과 내용 */}
            <div>
              <Label>제목</Label>
              <Input
                placeholder="직관일기 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>내용</Label>
              <textarea
                placeholder="오늘의 직관 경험을 자세히 적어보세요..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full mt-1 p-2 border rounded min-h-[120px]"
              />
            </div>

            <Button className="w-full" size="lg" onClick={() => setShowCreatePost(false)}>
              직관일기 작성 완료
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📝 직관일기</h2>
        <div className="flex gap-1">
          <Button variant={activeTab === "list" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("list")}>
            목록
          </Button>
          <Button
            variant={activeTab === "stats" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("stats")}
          >
            📊 통계
          </Button>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="flex gap-2">
        <Input
          placeholder="제목, 내용, 팀명, MVP 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        {searchQuery && (
          <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
            초기화
          </Button>
        )}
      </div>

      {/* 작성 버튼 */}
      <Button className="w-full" onClick={() => setShowCreatePost(true)}>
        ✏️ 새 직관일기 작성
      </Button>

      {/* 목록 탭 */}
      {activeTab === "list" && (
        <>
          {searchQuery && (
            <div className="text-sm text-gray-600">
              "{searchQuery}" 검색 결과: {filteredPosts.length}개
            </div>
          )}

          <div className="space-y-3">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>⚾</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {post.author === "야구팬123" && <><span className="font-bold text-sm">야구팬123</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-semibold shadow">LG팬</span></>}
                          {post.author === "찌라시킹" && <><span className="font-bold text-sm">찌라시킹</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-blue-700 text-white text-xs font-semibold shadow">두산팬</span></>}
                          {post.author === "분석왕" && <><span className="font-bold text-sm">분석왕</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-pink-600 text-white text-xs font-semibold shadow">키움팬</span></>}
                          {post.author === "직관러버" && <><span className="font-bold text-sm">직관러버</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-semibold shadow">SSG팬</span></>}
                          {post.author === "야구사랑" && <><span className="font-bold text-sm">야구사랑</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-red-700 text-white text-xs font-semibold shadow">KIA팬</span></>}
                          {post.author === "전문가" && <><span className="font-bold text-sm">전문가</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-blue-400 text-white text-xs font-semibold shadow">NC팬</span></>}
                          {["야구팬123", "찌라시킹", "분석왕", "직관러버", "야구사랑", "전문가"].indexOf(post.author) === -1 && (
                            <span className="font-bold text-sm">{post.author}</span>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {post.awayTeam} @ {post.homeTeam}
                          </Badge>
                          <Badge
                            variant={
                              post.result === "win" ? "default" : post.result === "lose" ? "destructive" : "secondary"
                            }
                            className="text-xs"
                          >
                            {post.result === "win" ? "승리" : post.result === "lose" ? "패배" : "무승부"}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            내 글
                          </Badge>
                        </div>

                        <h3 className="font-bold mb-2">{post.title}</h3>

                        {/* 직관일기 상세 정보 */}
                        <div className="grid grid-cols-2 gap-2 mb-2 text-xs text-gray-600">
                          <div>📅 {post.date}</div>
                          <div>⚾ {post.score}</div>
                          <div>
                            {post.weather === "sunny"
                              ? "☀️ 맑음"
                              : post.weather === "rainy"
                                ? "🌧️ 비"
                                : post.weather === "cloudy"
                                  ? "☁️ 흐림"
                                  : "💨 바람"}
                          </div>
                          <div>🏆 MVP: {post.mvp}</div>
                          <div>🎫 {post.seat}</div>
                          <div>
                            👥{" "}
                            {post.companion === "alone"
                              ? "혼자"
                              : post.companion === "friends"
                                ? "친구들과"
                                : post.companion === "family"
                                  ? "가족과"
                                  : post.companion === "couple"
                                    ? "연인과"
                                    : "동료들과"}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{post.content}</p>

                        {/* 사진 */}
                        {post.photos > 0 && (
                          <div className="flex gap-2 mb-3">
                            {Array.from({ length: Math.min(post.photos, 3) }).map((_, index) => (
                              <div
                                key={index}
                                className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center"
                              >
                                <span className="text-xs text-gray-400">📷</span>
                              </div>
                            ))}
                            {post.photos > 3 && (
                              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500">+{post.photos - 3}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 반응 버튼들 */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center gap-1 text-sm ${
                                likedPosts.has(post.id) ? "text-red-500" : "text-gray-500"
                              }`}
                            >
                              <Star className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-red-500" : ""}`} />
                              <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                            </button>
                            <button
                              className="flex items-center gap-1 text-sm text-gray-500"
                              onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{(comments[post.id]?.length || 0) + post.comments}</span>
                            </button>
                          </div>
                          <span className="text-xs text-gray-400">{post.date}</span>
                        </div>

                        {/* 댓글 섹션 */}
                        {showComments === post.id && (
                          <div className="border-t pt-3">
                            <div className="space-y-3 mb-3">
                              {comments[post.id]?.map((comment) => (
                                <div key={comment.id} className="flex gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs">👤</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                      <div className="font-medium text-xs mb-1">{comment.author}</div>
                                      <div className="text-sm">{comment.content}</div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                      <span>{comment.time}</span>
                                      <button className="flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        <span>{comment.likes}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">⚾</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 flex gap-2">
                                <Input
                                  placeholder="댓글을 입력하세요..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  className="text-sm"
                                  onKeyPress={(e) => e.key === "Enter" && handleAddComment(post.id)}
                                />
                                <Button size="sm" onClick={() => handleAddComment(post.id)}>
                                  작성
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">검색 결과가 없습니다.</div>
            )}
          </div>
        </>
      )}

      {/* 통계 탭 */}
      {activeTab === "stats" && (
        <div className="space-y-4">
          {/* 전체 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 나의 직관 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{myStats.totalGames}</div>
                  <div className="text-sm text-gray-600">총 관람 경기</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">{myStats.winRate}%</div>
                  <div className="text-sm text-gray-600">승률</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-600">{myStats.totalPhotos}</div>
                  <div className="text-sm text-gray-600">총 사진</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded">
                  <div className="text-2xl font-bold text-yellow-600">{myStats.totalLikes}</div>
                  <div className="text-sm text-gray-600">받은 좋아요</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 승패 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🏆 승패 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-600">✅ 승리</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(myStats.wins / myStats.totalGames) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{myStats.wins}경기</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-600">❌ 패배</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(myStats.losses / myStats.totalGames) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{myStats.losses}경기</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">⚖️ 무승부</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-500 h-2 rounded-full"
                        style={{ width: `${(myStats.draws / myStats.totalGames) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{myStats.draws}경기</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 선호도 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">❤️ 선호도</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>가장 많이 본 팀</span>
                <span className="font-bold text-blue-600">{myStats.favoriteTeam}</span>
              </div>
              <div className="flex justify-between">
                <span>선호 구장</span>
                <span className="font-bold text-blue-600">{myStats.favoriteStadium}</span>
              </div>
              <div className="flex justify-between">
                <span>주로 함께 가는 사람</span>
                <span className="font-bold text-blue-600">{myStats.mostVisitedWith}</span>
              </div>
            </CardContent>
          </Card>

          {/* 날씨별 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🌤️ 날씨별 관람</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>☀️ 맑음</span>
                  <span className="font-bold">{myStats.weatherStats.sunny}회</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>☁️ 흐림</span>
                  <span className="font-bold">{myStats.weatherStats.cloudy}회</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🌧️ 비</span>
                  <span className="font-bold">{myStats.weatherStats.rainy}회</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>💨 바람</span>
                  <span className="font-bold">{myStats.weatherStats.windy}회</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 기분별 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">😊 기분별 관람</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>😆 신남</span>
                  <span className="font-bold">{myStats.moodStats.excited}회</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>😊 기쁨</span>
                  <span className="font-bold">{myStats.moodStats.happy}회</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>😰 긴장</span>
                  <span className="font-bold">{myStats.moodStats.nervous}회</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>😢 슬픔</span>
                  <span className="font-bold">{myStats.moodStats.sad}회</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// 커뮤니티 페이지 컴포넌트
function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"all" | "team">("all")
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [contentType, setContentType] = useState<"text" | "poll" | "photo" | "rumor" | "diary">("text")
  const [showComments, setShowComments] = useState<number | null>(null)
  const [newComment, setNewComment] = useState("")
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [pollVotes, setPollVotes] = useState<Record<number, number>>({})
  const [comments, setComments] = useState<Record<number, Array<{ id: number; author: string; content: string; time: string; likes: number }>>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [contentFormData, setContentFormData] = useState<{
    title: string
    content: string
    category: string
    pollOptions?: string[]
  }>({
    title: "",
    content: "",
    category: "analysis",
    pollOptions: []
  })

  // 샘플 게시글 데이터
  const [posts] = useState<Post[]>([
    {
      id: 1,
      type: "text",
      author: "야구매니아",
      authorAvatar: "⚾",
      title: "오늘 경기 분석",
      content: "LG 트윈스의 타선이 점점 살아나고 있습니다...",
      date: "10분 전",
      likes: 15,
      comments: 8,
      category: "analysis",
      isPopular: true,
      isMine: false
    },
    {
      id: 2,
      type: "rumor",
      author: "찌라시킹",
      authorAvatar: "👀",
      title: "🔥 긴급속보: 대형 트레이드 루머",
      content: "믿을만한 소식통에 따르면 이번 시즌 중 대형 트레이드가 있을 예정이라고 합니다. A팀의 주력 타자와 B팀의 에이스 투수가 맞트레이드 될 가능성이 높다는 소식입니다. 공식 발표는 다음 주 예정...",
      date: "2024.01.15",
      likes: 234,
      comments: 67,
      category: "rumor",
      isHot: true,
      isMine: false
    },
    {
      id: 3,
      type: "poll",
      author: "분석왕",
      authorAvatar: "📊",
      title: "올해 홈런왕 예상은?",
      content: "2024시즌 홈런왕을 예상해보세요! 작년 성적과 올해 컨디션을 고려해서 투표해주세요.",
      date: "2024.01.15",
      pollOptions: ["강백호 (KT)", "김현수 (LG)", "최정 (SSG)", "나성범 (KIA)"],
      pollResults: [45, 32, 15, 8],
      totalVotes: 1247,
      likes: 89,
      comments: 34,
      category: "analysis",
      isMine: false
    },
    {
      id: 4,
      type: "photo",
      author: "직관러버",
      authorAvatar: "📸",
      title: "오늘 잠실 석양이 너무 예뻤어요",
      content: "경기 시작 전 잠실야구장에서 찍은 석양 사진입니다. 야구장에서 보는 석양이 이렇게 아름다울 줄이야! 🌅 경기도 재미있었지만 이 순간이 가장 인상깊었어요.",
      date: "2024.01.15",
      likes: 156,
      comments: 23,
      image: true,
      category: "photo",
      isMine: false
    },
    {
      id: 5,
      type: "text",
      author: "야구사랑",
      title: "투수 교체 타이밍",
      content: "7회초 2사 만루 상황에서 투수 교체가 늦었다고 생각합니다...",
      author: "전문가",
      date: "30분 전",
      likes: 23,
      comments: 12,
      type: "text",
      category: "analysis",
      isHot: true
    }
  ])

  // 구단별 게시판 데이터
  const teamBoards: Record<string, Post[]> = {
    "LG": [
      {
        id: 1,
        title: "오늘 경기 선발투수 누구일까요?",
        content: "김유신 선수가 선발로 나설 것 같은데, 여러분은 어떻게 생각하시나요?",
        author: "LG사랑",
        date: "10분 전",
        likes: 15,
        comments: 8,
        type: "text",
        category: "analysis"
      },
      {
        id: 2,
        title: "오늘 경기 승리 확신합니다!",
        content: "선발투수도 좋고 타선도 좋아요. 오늘은 반드시 이길 것 같습니다!",
        author: "트윈스매니아",
        date: "30분 전",
        likes: 23,
        comments: 12,
        type: "text",
        category: "diary"
      }
    ],
    "KT": [
      {
        id: 1,
        title: "KT 타선 살아나고 있습니다",
        content: "최근 5경기 타율 0.320으로 상승세를 보이고 있어요. 기대됩니다!",
        author: "위즈매니아",
        date: "15분 전",
        likes: 18,
        comments: 9,
        type: "text",
        category: "analysis"
      }
    ],
    "SSG": [
      {
        id: 1,
        title: "SSG 불펜진 강화 필요해요",
        content: "최근 불펜진이 불안정한 모습을 보이고 있습니다. 트레이드 필요할 것 같아요.",
        author: "랜더스킹",
        date: "1시간 전",
        likes: 25,
        comments: 15,
        type: "text",
        category: "analysis"
      }
    ]
  }

  const handleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts)
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    setLikedPosts(newLikedPosts)
  }

  const handlePollVote = (postId: number, optionIndex: number) => {
    setPollVotes((prev) => ({ ...prev, [postId]: optionIndex }))
  }

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      author: "야구팬123",
      content: newComment,
      time: "방금 전",
      likes: 0,
    }

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment],
    }))
    setNewComment("")
  }

  // 검색 필터링
  const filteredPosts = Object.values(teamBoards).flat().filter((post) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    )
  })

  // 탭별 필터링
  const getFilteredPosts = () => {
    let posts = filteredPosts
    if (activeTab === "team") {
      posts = posts.filter((post) => post.category === selectedTeam)
    }
    return posts
  }

  // 포스트 카드 컴포넌트
  const PostCard = ({ post }: { post: Post }) => (
    <Card key={post.id} className={post.isPopular || post.isHot ? "ring-2 ring-yellow-400" : ""}>
      <CardContent className="p-4">
        {(post.isPopular || post.isHot) && (
          <div className="flex items-center gap-1 mb-2">
            <Badge className="bg-yellow-500 text-white">{post.isPopular ? "🔥 인기" : "🔥 HOT"}</Badge>
            <Badge variant="outline" className="text-xs">
              {post.category === "rumor"
                ? "찌라시"
                : post.category === "analysis"
                  ? "분석"
                  : post.category === "photo"
                    ? "사진"
                    : post.category === "diary"
                      ? "직관일기"
                      : "일반"}
            </Badge>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{post.authorAvatar || post.authorBadge}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {post.author === "야구팬123" && <><span className="font-bold text-sm">야구팬123</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-semibold shadow">LG팬</span></>}
              {post.author === "찌라시킹" && <><span className="font-bold text-sm">찌라시킹</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-blue-700 text-white text-xs font-semibold shadow">두산팬</span></>}
              {post.author === "분석왕" && <><span className="font-bold text-sm">분석왕</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-pink-600 text-white text-xs font-semibold shadow">키움팬</span></>}
              {post.author === "직관러버" && <><span className="font-bold text-sm">직관러버</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-semibold shadow">SSG팬</span></>}
              {post.author === "야구사랑" && <><span className="font-bold text-sm">야구사랑</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-red-700 text-white text-xs font-semibold shadow">KIA팬</span></>}
              {post.author === "전문가" && <><span className="font-bold text-sm">전문가</span><span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-blue-400 text-white text-xs font-semibold shadow">NC팬</span></>}
              {["야구팬123", "찌라시킹", "분석왕", "직관러버", "야구사랑", "전문가"].indexOf(post.author) === -1 && (
                <span className="font-bold text-sm">{post.author}</span>
              )}
              <Badge variant="secondary" className="text-xs">
                {post.type === "poll"
                  ? "투표"
                  : post.type === "photo"
                    ? "사진"
                    : post.type === "rumor"
                      ? "찌라시"
                      : post.type === "diary"
                        ? "직관일기"
                        : "텍스트"}
              </Badge>
              {post.isMine && (
                <Badge variant="outline" className="text-xs">
                  내 글
                </Badge>
              )}
            </div>

            <h3 className="font-bold mb-2">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{post.content}</p>

            {/* 투표 */}
            {post.type === "poll" && (
              <div className="mb-3 p-3 bg-gray-50 rounded">
                <div className="space-y-2">
                  {post.pollOptions.map((option, index) => {
                    const percentage = post.pollResults[index]
                    const isVoted = pollVotes[post.id] === index
                    const hasVoted = pollVotes[post.id] !== undefined

                    return (
                      <div key={index} className="relative">
                        <Button
                          variant={isVoted ? "default" : "outline"}
                          className="w-full justify-start text-sm h-auto p-2"
                          onClick={() => !hasVoted && handlePollVote(post.id, index)}
                          disabled={hasVoted}
                        >
                          <div className="flex justify-between w-full">
                            <span>{option}</span>
                            {hasVoted && <span>{percentage}%</span>}
                          </div>
                        </Button>
                        {hasVoted && (
                          <div
                            className="absolute top-0 left-0 h-full bg-blue-200 rounded opacity-30"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  총 {post.totalVotes.toLocaleString()}명 참여
                </div>
              </div>
            )}

            {/* 이미지 */}
            {post.image && (
              <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                <span className="text-gray-400">📷 사진</span>
              </div>
            )}

            {/* 반응 버튼들 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 text-sm ${
                    likedPosts.has(post.id) ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  <Star className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-red-500" : ""}`} />
                  <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                </button>
                <button
                  className="flex items-center gap-1 text-sm text-gray-500"
                  onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{(comments[post.id]?.length || 0) + post.comments}</span>
                </button>
              </div>
              <span className="text-xs text-gray-400">{post.date}</span>
            </div>

            {/* 댓글 섹션 */}
            {showComments === post.id && (
              <div className="border-t pt-3">
                <div className="space-y-3 mb-3">
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">👤</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="font-medium text-xs mb-1">{comment.author}</div>
                          <div className="text-sm">{comment.content}</div>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{comment.time}</span>
                          <button className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span>{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">⚾</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="댓글을 입력하세요..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="text-sm"
                      onKeyPress={(e) => e.key === "Enter" && handleAddComment(post.id)}
                    />
                    <Button size="sm" onClick={() => handleAddComment(post.id)}>
                      작성
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // 콘텐츠 작성 폼
  if (showCreatePost) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setShowCreatePost(false)}>
            ← 뒤로
          </Button>
          <h2 className="text-lg font-bold">✏️ 글 작성</h2>
          <div></div>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            {/* 콘텐츠 타입 선택 */}
            <div>
              <Label>글 타입</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Button
                  variant={contentType === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setContentType("text")}
                >
                  📝 텍스트
                </Button>
                <Button
                  variant={contentType === "poll" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setContentType("poll")}
                >
                  📊 투표
                </Button>
                <Button
                  variant={contentType === "photo" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setContentType("photo")}
                >
                  📸 사진
                </Button>
                <Button
                  variant={contentType === "rumor" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setContentType("rumor")}
                >
                  📰 찌라시
                </Button>
              </div>
            </div>

            {/* 카테고리 선택 */}
            <div>
              <Label>카테고리</Label>
              <select
                className="w-full mt-1 p-2 border rounded"
                value={contentFormData.category}
                onChange={(e) => setContentFormData({ ...contentFormData, category: e.target.value })}
              >
                <option value="general">일반</option>
                <option value="analysis">분석</option>
                <option value="rumor">찌라시</option>
                <option value="photo">사진</option>
                <option value="humor">유머</option>
              </select>
            </div>

            {/* 제목 */}
            <div>
              <Label>제목</Label>
              <Input
                placeholder="제목을 입력하세요"
                value={contentFormData.title}
                onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* 내용 */}
            <div>
              <Label>내용</Label>
              <textarea
                placeholder="내용을 입력하세요..."
                value={contentFormData.content}
                onChange={(e) => setContentFormData({ ...contentFormData, content: e.target.value })}
                className="w-full mt-1 p-2 border rounded min-h-[100px]"
              />
            </div>

            {/* 투표 옵션 (투표 타입일 때만) */}
            {contentType === "poll" && (
              <div>
                <Label>투표 옵션</Label>
                <div className="space-y-2 mt-1">
                  {contentFormData.pollOptions.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`옵션 ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...contentFormData.pollOptions]
                        newOptions[index] = e.target.value
                        setContentFormData({ ...contentFormData, pollOptions: newOptions })
                      }}
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setContentFormData({
                        ...contentFormData,
                        pollOptions: [...contentFormData.pollOptions, ""],
                      })
                    }
                  >
                    + 옵션 추가
                  </Button>
                </div>
              </div>
            )}

            {/* 사진 업로드 (사진 타입일 때만) */}
            {contentType === "photo" && (
              <div>
                <Label>사진 업로드</Label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <span className="text-gray-400">📷 사진을 업로드하세요</span>
                </div>
              </div>
            )}

            <Button className="w-full" size="lg" onClick={() => setShowCreatePost(false)}>
              작성 완료
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setShowCreatePost(false)}>
          ← 뒤로
        </Button>
        <h2 className="text-lg font-bold">💬 커뮤니티</h2>
        <Button onClick={() => setShowCreatePost(true)}>✏️ 글쓰기</Button>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          onClick={() => setActiveTab("all")}
          className="flex-1"
        >
          전체
        </Button>
        <Button
          variant={activeTab === "team" ? "default" : "outline"}
          onClick={() => setActiveTab("team")}
          className="flex-1"
        >
          구단별
        </Button>
      </div>

      {/* 구단별 게시판 */}
      {activeTab === "team" && (
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(teamBoards).map(([team, posts]) => (
            <Card
              key={team}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedTeam(team)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={teamLogos[team]} alt={team} />
                    <AvatarFallback className="font-bold">{team}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-lg">{team}</div>
                    <div className="text-sm text-gray-600">게시글 {posts.length}개</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 선택된 구단 게시판 */}
      {selectedTeam && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedTeam(null)}>
              ← 뒤로
            </Button>
            <h3 className="text-lg font-bold">{selectedTeam} 게시판</h3>
            <Button onClick={() => setShowCreatePost(true)}>✏️ 글쓰기</Button>
          </div>
          
          <div className="space-y-4">
            {teamBoards[selectedTeam]?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* 기존 전체 게시판 내용 */}
      {activeTab === "all" && !selectedTeam && (
        <>
          {/* 검색창 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="검색어를 입력하세요"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              전체
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              분석
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              일기
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              질문
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              투표
            </Button>
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}

      {/* 글쓰기 모달 */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">글쓰기</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreatePost(false)}>
                  ✕
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>제목</Label>
                  <Input 
                    placeholder="제목을 입력하세요" 
                    value={contentFormData.title}
                    onChange={(e) => setContentFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>내용</Label>
                  <textarea
                    className="w-full h-32 p-2 border rounded-md"
                    placeholder="내용을 입력하세요"
                    value={contentFormData.content}
                    onChange={(e) => setContentFormData(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>카테고리</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={contentFormData.category}
                    onChange={(e) => setContentFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="analysis">분석</option>
                    <option value="diary">일기</option>
                    <option value="question">질문</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                    취소
                  </Button>
                  <Button>등록</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// 팬 랭킹 페이지 컴포넌트
function RankingPage() {
  const [activeTab, setActiveTab] = useState("team") // "team", "fan"
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  const teamRankings = [
    { team: "LG", fans: 15420, avgActivity: 8.7, rank: 1, change: 0 },
    { team: "두산", fans: 14890, avgActivity: 8.5, rank: 2, change: 1 },
    { team: "KT", fans: 13650, avgActivity: 8.2, rank: 3, change: -1 },
    { team: "SSG", fans: 12580, avgActivity: 7.9, rank: 4, change: 0 },
    { team: "키움", fans: 11920, avgActivity: 7.6, rank: 5, change: 0 },
    { team: "KIA", fans: 11450, avgActivity: 7.4, rank: 6, change: 1 },
    { team: "삼성", fans: 10980, avgActivity: 7.2, rank: 7, change: -1 },
    { team: "롯데", fans: 10650, avgActivity: 7.0, rank: 8, change: 0 },
    { team: "NC", fans: 9870, avgActivity: 6.8, rank: 9, change: 0 },
    { team: "한화", fans: 9320, avgActivity: 6.5, rank: 10, change: 0 },
  ]

  // 각 팀별 팬 랭킹 데이터
  const teamFanRankings = {
    LG: [
      {
        rank: 1,
        nickname: "LG사랑",
        level: "LV.15",
        points: 2850,
        activity: 9.8,
        badge: "👑",
        achievements: ["연승예측왕", "직관마스터", "커뮤니티킹"],
        change: 0,
      },
      {
        rank: 2,
        nickname: "트윈스매니아",
        level: "LV.14",
        points: 2720,
        activity: 9.5,
        badge: "🔥",
        achievements: ["예측달인", "일기왕"],
        change: 1,
      },
      {
        rank: 3,
        nickname: "잠실의전설",
        level: "LV.13",
        points: 2650,
        activity: 9.3,
        badge: "⚾",
        achievements: ["직관러버", "분석왕"],
        change: -1,
      },
      {
        rank: 4,
        nickname: "야구팬123",
        level: "LV.7",
        points: 1250,
        activity: 7.2,
        badge: "⚾",
        achievements: ["첫예측", "연승왕"],
        change: 2,
        isMe: true,
      },
      {
        rank: 5,
        nickname: "LG4ever",
        level: "LV.8",
        points: 1180,
        activity: 7.0,
        badge: "📝",
        achievements: ["직관러"],
        change: -1,
      },
    ],
    두산: [
      {
        rank: 1,
        nickname: "베어스킹",
        level: "LV.16",
        points: 3100,
        activity: 9.9,
        badge: "👑",
        achievements: ["두산마스터", "예측왕", "커뮤니티킹"],
        change: 0,
      },
      {
        rank: 2,
        nickname: "잠실곰",
        level: "LV.14",
        points: 2800,
        activity: 9.4,
        badge: "🔥",
        achievements: ["직관달인", "분석왕"],
        change: 0,
      },
    ],
    KT: [
      {
        rank: 1,
        nickname: "위즈매직",
        level: "LV.15",
        points: 2900,
        activity: 9.6,
        badge: "👑",
        achievements: ["KT사랑", "예측마스터"],
        change: 0,
      },
    ],
  }

  // 구단 내 팬 랭킹 보기
  if (selectedTeam) {
    const fanRankings = teamFanRankings[selectedTeam as keyof typeof teamFanRankings] || []

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedTeam(null)}>
            ← 뒤로
          </Button>
          <h2 className="text-lg font-bold">🏆 {selectedTeam} 팬 랭킹</h2>
          <div></div>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">⚾ {selectedTeam} 팬 활동 순위</CardTitle>
            <p className="text-sm text-gray-600">{selectedTeam}을 응원하는 팬들의 활동 순위입니다</p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {fanRankings.map((fan, index) => (
                <div
                  key={fan.rank}
                  className={`flex items-center gap-3 p-4 border-b last:border-b-0 ${
                    fan.isMe
                      ? "bg-blue-50 border-blue-200"
                      : index < 3
                        ? "bg-gradient-to-r from-yellow-50 to-transparent"
                        : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-center w-8 font-bold ${
                        fan.rank === 1
                          ? "text-yellow-600"
                          : fan.rank === 2
                            ? "text-gray-500"
                            : fan.rank === 3
                              ? "text-orange-600"
                              : "text-gray-700"
                      }`}
                    >
                      #{fan.rank}
                    </div>
                    {fan.rank <= 3 && (
                      <div className="text-lg">{fan.rank === 1 ? "🥇" : fan.rank === 2 ? "🥈" : "🥉"}</div>
                    )}
                    {fan.change !== 0 && (
                      <div className={`text-xs ${fan.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {fan.change > 0 ? "↗" : "↘"}
                        {Math.abs(fan.change)}
                      </div>
                    )}
                  </div>

                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{fan.badge}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${fan.isMe ? "text-blue-600" : ""}`}>🔥 {fan.nickname}</span>
                      {fan.isMe && (
                        <Badge variant="secondary" className="text-xs">
                          나
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{fan.level}</span>
                      <span>•</span>
                      <span>{fan.points.toLocaleString()}P</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {fan.achievements.slice(0, 2).map((achievement, i) => (
                        <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                          {achievement}
                        </Badge>
                      ))}
                      {fan.achievements.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{fan.achievements.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-blue-600">{fan.activity}</div>
                    <div className="text-xs text-gray-500">활성도</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm font-medium text-green-800 mb-2">🎯 내 순위 향상 팁</div>
              <div className="text-xs text-green-600 space-y-1">
                <div>• 직관일기를 꾸준히 작성하세요</div>
                <div>• 예측게임에 적극 참여하세요</div>
                <div>• 커뮤니티에서 활발히 소통하세요</div>
                <div>• 다른 팬들의 글에 좋아요를 눌러주세요</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🏆 팬 랭킹</h2>
      </div>

      {/* 구단별 랭킹 */}
      <div className="space-y-4">
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">🏆 6월 구단별 팬 활동 랭킹</CardTitle>
            <p className="text-sm text-gray-600">각 구단 팬들의 활동을 집계해 순위를 매깁니다</p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {teamRankings.map((team, index) => (
                <div
                  key={team.rank}
                  className={`flex items-center gap-4 p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                    index < 3 ? "bg-gradient-to-r from-yellow-50 to-transparent" : ""
                  }`}
                  onClick={() => setSelectedTeam(team.team)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-center w-8 font-bold ${
                        team.rank === 1
                          ? "text-yellow-600"
                          : team.rank === 2
                            ? "text-gray-500"
                            : team.rank === 3
                              ? "text-orange-600"
                              : "text-gray-700"
                      }`}
                    >
                      #{team.rank}
                    </div>
                    {team.rank <= 3 && (
                      <div className="text-lg">{team.rank === 1 ? "🥇" : team.rank === 2 ? "🥈" : "🥉"}</div>
                    )}
                    {team.change !== 0 && (
                      <div className={`text-xs ${team.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {team.change > 0 ? "↗" : "↘"}
                        {Math.abs(team.change)}
                      </div>
                    )}
                  </div>

                  <Avatar className="w-12 h-12">
                    <AvatarImage src={teamLogos[team.team]} alt={team.team} className="object-contain" />
                    <AvatarFallback className="font-bold">{team.team}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="font-bold text-lg">{team.team}</div>
                    <div className="text-sm text-gray-600">팬 {team.fans.toLocaleString()}명</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${(team.avgActivity / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{team.avgActivity}/10</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-blue-600 text-lg">활성도 {team.avgActivity}</div>
                    <div className="text-xs text-gray-500">평균 점수</div>
                    <div className="text-xs text-blue-500 mt-1">👆 탭하여 구단 내 순위 보기</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm font-medium text-blue-800 mb-2">📊 활동도 계산 방식</div>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• 직관일기 작성 빈도</div>
                <div>• 예측게임 참여율</div>
                <div>• 커뮤니티 활동</div>
                <div>• 앱 사용 시간</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 마이페이지 컴포넌트
function MyPage() {
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [isPremium, setIsPremium] = useState(false) // 프리미엄 구독 상태
  const [showMonthlyReport, setShowMonthlyReport] = useState(false)

  const monthlyReport = {
    month: "2025년 6월",
    directViewings: 4,
    postsWritten: 3,
    likesReceived: 89,
    predictionsWon: 7,
    totalPredictions: 12,
    winRate: 58.3,
    pointsEarned: 450,
    badgesEarned: 2,
    topMoments: [
      { type: "prediction", description: "5연승 예측 성공", date: "6월 15일" },
      { type: "diary", description: "인기 직관일기 작성", date: "6월 12일" },
      { type: "community", description: "베스트 댓글 선정", date: "6월 8일" },
    ],
    monthlyGoals: {
      predictions: { current: 7, target: 10 },
      diaries: { current: 3, target: 5 },
      likes: { current: 89, target: 100 },
    },
  }

  // 프리미엄 구독 모달
  const PremiumModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">⭐ 프리미엄 구독</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowPremiumModal(false)}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">월 3,000원</div>
            <div className="text-sm text-gray-600">첫 달 무료 체험!</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded">
              <div className="text-yellow-600">🚫</div>
              <div>
                <div className="font-medium text-sm">광고 완전 제거</div>
                <div className="text-xs text-gray-600">모든 광고 없이 깔끔한 이용</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded">
              <div className="text-purple-600">👑</div>
              <div>
                <div className="font-medium text-sm">프리미엄 팬 레벨 & 뱃지</div>
                <div className="text-xs text-gray-600">특별한 레벨과 한정 뱃지 획득</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
              <div className="text-blue-600">📊</div>
              <div>
                <div className="font-medium text-sm">팬 레포트 제공</div>
                <div className="text-xs text-gray-600">월별/연도별 상세 분석 제공</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
              <div className="text-green-600">🎯</div>
              <div>
                <div className="font-medium text-sm">예측 & 퀴즈 무제한</div>
                <div className="text-xs text-gray-600">일일 제한 없이 무제한 참여</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-red-50 rounded">
              <div className="text-red-600">⚡</div>
              <div>
                <div className="font-medium text-sm">우선 지원 & 신기능</div>
                <div className="text-xs text-gray-600">고객지원 우선 처리 및 베타 기능</div>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            size="lg"
            onClick={() => {
              setIsPremium(true)
              setShowPremiumModal(false)
            }}
          >
            ⭐ 프리미엄 구독하기
          </Button>

          <div className="text-xs text-center text-gray-500">언제든지 구독 취소 가능 • 자동 갱신</div>
        </CardContent>
      </Card>
    </div>
  )

  // 상세한 월별 리포트 모달
  const MonthlyReportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">📊 월별 리포트</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMonthlyReport(false)}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{monthlyReport.month}</div>
            <div className="text-sm opacity-90">나의 야구팬 활동 요약</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* 주요 지표 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{monthlyReport.directViewings}</div>
              <div className="text-sm text-gray-600">직관 횟수</div>
              <div className="text-xs text-blue-500 mt-1">⚾ 야구장 방문</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{monthlyReport.postsWritten}</div>
              <div className="text-sm text-gray-600">작성한 글</div>
              <div className="text-xs text-green-500 mt-1">📝 직관일기 & 커뮤니티</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{monthlyReport.likesReceived}</div>
              <div className="text-sm text-gray-600">받은 좋아요</div>
              <div className="text-xs text-purple-500 mt-1">❤️ 인기도</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{monthlyReport.predictionsWon}</div>
              <div className="text-sm text-gray-600">예측 성공</div>
              <div className="text-xs text-yellow-500 mt-1">🎯 {monthlyReport.winRate}% 승률</div>
            </div>
          </div>

          {/* 예측 게임 상세 */}
          <Card className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">🎯 예측 게임 성과</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>총 예측 횟수</span>
                <span className="font-bold">{monthlyReport.totalPredictions}회</span>
              </div>
              <div className="flex justify-between items-center">
                <span>성공한 예측</span>
                <span className="font-bold text-green-600">{monthlyReport.predictionsWon}회</span>
              </div>
              <div className="flex justify-between items-center">
                <span>승률</span>
                <span className="font-bold text-blue-600">{monthlyReport.winRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${monthlyReport.winRate}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 text-center">
                평균 승률보다 {monthlyReport.winRate > 50 ? "높음" : "낮음"} 📈
              </div>
            </CardContent>
          </Card>

          {/* 이달의 하이라이트 */}
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">⭐ 이달의 하이라이트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {monthlyReport.topMoments.map((moment, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl">
                    {moment.type === "prediction" ? "🎯" : moment.type === "diary" ? "📝" : "💬"}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{moment.description}</div>
                    <div className="text-xs text-gray-500">{moment.date}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 월간 목표 달성도 */}
          <Card className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">🎯 월간 목표 달성도</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>예측 성공</span>
                  <span>
                    {monthlyReport.monthlyGoals.predictions.current}/{monthlyReport.monthlyGoals.predictions.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(monthlyReport.monthlyGoals.predictions.current / monthlyReport.monthlyGoals.predictions.target) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>직관일기 작성</span>
                  <span>
                    {monthlyReport.monthlyGoals.diaries.current}/{monthlyReport.monthlyGoals.diaries.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(monthlyReport.monthlyGoals.diaries.current / monthlyReport.monthlyGoals.diaries.target) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>좋아요 받기</span>
                  <span>
                    {monthlyReport.monthlyGoals.likes.current}/{monthlyReport.monthlyGoals.likes.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${(monthlyReport.monthlyGoals.likes.current / monthlyReport.monthlyGoals.likes.target) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 포인트 & 뱃지 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-2xl font-bold text-yellow-600">{monthlyReport.pointsEarned}P</div>
                <div className="text-sm text-gray-600">획득 포인트</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-purple-600">{monthlyReport.badgesEarned}</div>
                <div className="text-sm text-gray-600">새 뱃지</div>
              </CardContent>
            </Card>
          </div>

          {/* 다음 달 목표 */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600 mb-2">🚀 다음 달 도전!</div>
                <div className="text-sm text-gray-600">
                  더 많은 직관과 예측으로
                  <br />
                  야구팬 레벨을 올려보세요!
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

  function PointSystem() {
    const [points, setPoints] = useState(0)
    const [level, setLevel] = useState(1)
    const [quests, setQuests] = useState([
      {
        id: 1,
        title: "오늘의 예측",
        description: "오늘 경기 결과 예측하기",
        reward: 50,
        completed: false
      },
      {
        id: 2,
        title: "분석가 되기",
        description: "경기 분석글 작성하기",
        reward: 100,
        completed: false
      },
      {
        id: 3,
        title: "소통왕",
        description: "5개의 댓글 달기",
        reward: 25,
        completed: false
      }
    ])

    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">현재 포인트</div>
                <div className="text-2xl font-bold">{points}P</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">레벨</div>
                <div className="text-2xl font-bold">Lv.{level}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h3 className="font-bold mb-2">오늘의 퀘스트</h3>
          <div className="space-y-2">
            {quests.map(quest => (
              <Card key={quest.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{quest.title}</div>
                      <div className="text-sm text-gray-600">{quest.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">보상</div>
                      <div className="font-bold text-yellow-500">+{quest.reward}P</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 마이페이지 프로필 카드 및 월별 리포트에 상세 통계 추가
  // 예시 데이터
  const myFanStats = {
    comments: 52,
    communityPosts: 12,
    communityLikes: 134,
    predictionChange: 8, // %
    avgPostsPerDay: 0.4,
    avgCommentsPerDay: 1.7,
    avgPredictionsPerDay: 1.2,
    bestDay: '토요일',
    bestTime: '20~22시',
    rankChange: 4, // +4
    totalPoints: 2350,
    totalBadges: 7,
    keywords: ['홈런', '응원', '분석', '직관'],
    bestFriends: ['야구매니아', '직관러버'],
    weekActivity: [3, 5, 2, 6, 4, 7, 8], // 최근 7일 활동
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">👤 마이페이지</h2>

      {/* 프리미엄 구독 카드 */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">⭐ 프리미엄 구독</h3>
                <p className="text-sm opacity-90">광고 제거 + 특별 혜택</p>
                <p className="text-lg font-bold">월 3,000원</p>
              </div>
              <Button className="bg-white text-yellow-600 hover:bg-gray-100" onClick={() => setShowPremiumModal(true)}>
                구독하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 프리미엄 회원 상태 표시 */}
      {isPremium && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">👑 프리미엄 회원</h3>
                <p className="text-sm opacity-90">모든 프리미엄 기능 이용 중</p>
                <p className="text-sm">다음 결제일: 2024.02.15</p>
              </div>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600"
                size="sm"
              >
                구독 관리
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 프로필 카드 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">{isPremium ? "👑" : "⚾"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">야구팬123</h3>
                {isPremium && <Badge className="bg-purple-500">👑 PREMIUM</Badge>}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={isPremium ? "bg-purple-500" : "bg-blue-500"}>{isPremium ? "LV.7 PRO" : "LV.7"}</Badge>
                <span className="text-sm text-gray-600">1,250P</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {isPremium ? "프리미엄 레벨까지 150P" : "다음 레벨까지 350P"}
              </p>
            </div>
          </div>
          {/* 프로필 카드 하단에 추가 */}
          {isPremium && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-xs text-gray-500">작성 댓글</div>
                <div className="text-xl font-bold">{myFanStats.comments}개</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-xs text-gray-500">커뮤니티 글</div>
                <div className="text-xl font-bold">{myFanStats.communityPosts}개</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <div className="text-xs text-gray-500">받은 좋아요</div>
                <div className="text-xl font-bold">{myFanStats.communityLikes}개</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-xs text-gray-500">예측 성공률 변화</div>
                <div className="text-xl font-bold text-green-600">+{myFanStats.predictionChange}%</div>
              </div>
              <div className="p-3 bg-pink-50 rounded">
                <div className="text-xs text-gray-500">일일 평균 글</div>
                <div className="text-xl font-bold">{myFanStats.avgPostsPerDay}</div>
              </div>
              <div className="p-3 bg-pink-50 rounded">
                <div className="text-xs text-gray-500">일일 평균 댓글</div>
                <div className="text-xl font-bold">{myFanStats.avgCommentsPerDay}</div>
              </div>
              <div className="p-3 bg-pink-50 rounded">
                <div className="text-xs text-gray-500">일일 평균 예측</div>
                <div className="text-xl font-bold">{myFanStats.avgPredictionsPerDay}</div>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <div className="text-xs text-gray-500">팬랭킹 변화</div>
                <div className="text-xl font-bold text-blue-600">▲{myFanStats.rankChange}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">누적 포인트</div>
                <div className="text-xl font-bold">{myFanStats.totalPoints}P</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">누적 뱃지</div>
                <div className="text-xl font-bold">{myFanStats.totalBadges}개</div>
              </div>
              <div className="p-3 bg-indigo-50 rounded col-span-2">
                <div className="text-xs text-gray-500">최다 활동 요일/시간대</div>
                <div className="text-lg font-bold">{myFanStats.bestDay} / {myFanStats.bestTime}</div>
              </div>
              <div className="p-3 bg-cyan-50 rounded col-span-2">
                <div className="text-xs text-gray-500">가장 많이 쓴 키워드</div>
                <div className="flex gap-2 flex-wrap mt-1">
                  {myFanStats.keywords.map((k) => <span key={k} className="bg-cyan-200 text-cyan-800 rounded px-2 py-0.5 text-xs font-semibold">{k}</span>)}
                </div>
              </div>
              <div className="p-3 bg-lime-50 rounded col-span-2">
                <div className="text-xs text-gray-500">가장 많이 소통한 팬</div>
                <div className="flex gap-2 flex-wrap mt-1">
                  {myFanStats.bestFriends.map((f) => <span key={f} className="bg-lime-200 text-lime-800 rounded px-2 py-0.5 text-xs font-semibold">{f}</span>)}
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded col-span-2">
                <div className="text-xs text-gray-500 mb-1">최근 7일 활동</div>
                <div className="flex items-end gap-1 h-16">
                  {myFanStats.weekActivity.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-4 bg-yellow-400 rounded-t" style={{ height: `${v * 10}px` }}></div>
                      <div className="text-[10px] mt-1">{i+1}일</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 획득 뱃지 섹션 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-4">🏆 획득 뱃지</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">⭐</span>
              </div>
              <span className="text-sm font-medium text-center">첫 게시글</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">🎯</span>
              </div>
              <span className="text-sm font-medium text-center">예측왕</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">💬</span>
              </div>
              <span className="text-sm font-medium text-center">댓글왕</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">👑</span>
              </div>
              <span className="text-sm font-medium text-center">프리미엄</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-pink-50 rounded-lg">
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">❤️</span>
              </div>
              <span className="text-sm font-medium text-center">인기글</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">📝</span>
              </div>
              <span className="text-sm font-medium text-center">작성왕</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">🎮</span>
              </div>
              <span className="text-sm font-medium text-center">게임왕</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-cyan-50 rounded-lg">
              <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">🌟</span>
              </div>
              <span className="text-sm font-medium text-center">신인왕</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 월별 리포트 보기 */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => (isPremium ? setShowMonthlyReport(true) : setShowPremiumModal(true))}
      >
        📊 월별 리포트 보기 {!isPremium && "(프리미엄)"}
      </Button>

      {/* 획득 뱃지 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">획득 뱃지</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: "첫 예측", icon: "🎯", earned: true, premium: false },
              { name: "연승왕", icon: "🔥", earned: true, premium: false },
              { name: "직관러", icon: "⚾", earned: true, premium: false },
              { name: "퀴즈킹", icon: "🧠", earned: false, premium: false },
              { name: "프리미엄", icon: "👑", earned: isPremium, premium: true },
              { name: "VIP팬", icon: "💎", earned: isPremium, premium: true },
              { name: "분석왕", icon: "📊", earned: isPremium, premium: true },
              { name: "무제한", icon: "⚡", earned: isPremium, premium: true },
            ].map((badge, index) => (
              <div
                key={index}
                className={`text-center p-2 rounded ${
                  badge.earned
                    ? badge.premium
                      ? "bg-purple-50 ring-1 ring-purple-200"
                      : "bg-yellow-50"
                    : "bg-gray-100"
                }`}
              >
                <div className={`text-2xl mb-1 ${badge.earned ? "" : "grayscale"}`}>{badge.icon}</div>
                <div
                  className={`text-xs ${
                    badge.earned ? (badge.premium ? "font-medium text-purple-600" : "font-medium") : "text-gray-400"
                  }`}
                >
                  {badge.name}
                </div>
                {badge.premium && !isPremium && <div className="text-xs text-purple-500 mt-1">프리미엄</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 프리미엄 혜택 미리보기 (비구독자용) */}
      {!isPremium && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-700">⭐ 프리미엄 혜택</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-600">🚫</span>
              <span>모든 광고 제거</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-600">👑</span>
              <span>프리미엄 레벨 & 특별 뱃지</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-600">📊</span>
              <span>직관일기 상세 통계 (월별/연도별)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-600">🎯</span>
              <span>예측게임 & 퀴즈 무제한 참여</span>
            </div>
            <Button className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600" onClick={() => setShowPremiumModal(true)}>
              월 3,000원으로 업그레이드
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 프리미엄 구독 모달 */}
      {showPremiumModal && <PremiumModal />}

      {/* 월별 리포트 모달 */}
      {showMonthlyReport && <MonthlyReportModal />}
    </div>
  )
}

// 메인 앱 컴포넌트
export default function BaseballFanApp() {
  const [activeTab, setActiveTab] = useState("home")

  const tabs = [
    { id: "home", label: "홈", icon: Home, component: HomePage },
    { id: "prediction", label: "예측게임", icon: Target, component: PredictionPage },
    { id: "diary", label: "직관일기", icon: BookOpen, component: DiaryPage },
    { id: "community", label: "커뮤니티", icon: MessageCircle, component: CommunityPage },
    { id: "ranking", label: "랭킹", icon: Trophy, component: RankingPage },
    { id: "my", label: "마이", icon: User, component: MyPage },
  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || HomePage

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* 메인 콘텐츠 */}
      <div className="pb-20 p-4">
        <ActiveComponent />
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-1 text-center ${activeTab === tab.id ? "text-blue-600" : "text-gray-400"}`}
            >
              <tab.icon className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const teamLogos: Record<string, string> = {
  "LG": "https://upload.wikimedia.org/wikipedia/ko/thumb/4/4a/LG_Twins_logo.svg/200px-LG_Twins_logo.svg.png",
  "KT": "https://upload.wikimedia.org/wikipedia/ko/thumb/5/5a/KT_Wiz_logo.svg/200px-KT_Wiz_logo.svg.png",
  "SSG": "https://upload.wikimedia.org/wikipedia/ko/thumb/8/8c/SSG_Landers_logo.svg/200px-SSG_Landers_logo.svg.png",
  "NC": "https://upload.wikimedia.org/wikipedia/ko/thumb/8/8a/NC_Dinos_logo.svg/200px-NC_Dinos_logo.svg.png",
  "두산": "https://upload.wikimedia.org/wikipedia/ko/thumb/9/9e/Doosan_Bears_logo.svg/200px-Doosan_Bears_logo.svg.png",
  "KIA": "https://upload.wikimedia.org/wikipedia/ko/thumb/4/4a/KIA_Tigers_logo.svg/200px-KIA_Tigers_logo.svg.png",
  "롯데": "https://upload.wikimedia.org/wikipedia/ko/thumb/2/2b/Lotte_Giants_logo.svg/200px-Lotte_Giants_logo.svg.png",
  "삼성": "https://upload.wikimedia.org/wikipedia/ko/thumb/2/2b/Samsung_Lions_logo.svg/200px-Samsung_Lions_logo.svg.png",
  "한화": "https://upload.wikimedia.org/wikipedia/ko/thumb/4/4a/Hanwha_Eagles_logo.svg/200px-Hanwha_Eagles_logo.svg.png",
  "키움": "https://upload.wikimedia.org/wikipedia/ko/thumb/8/8a/Kiwoom_Heroes_logo.svg/200px-Kiwoom_Heroes_logo.svg.png"
}

// 구단별 색상 매핑
const teamColors: Record<string, string> = {
  'LG': 'text-purple-600',
  'KT': 'text-gray-800',
  'SSG': 'text-red-500',
  'NC': 'text-blue-400',
  '두산': 'text-blue-700',
  'KIA': 'text-red-700',
  '롯데': 'text-orange-500',
  '삼성': 'text-blue-500',
  '한화': 'text-yellow-600',
  '키움': 'text-pink-600',
}
