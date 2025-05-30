type FileItem = {
  name: string;
  type: string;
  content: string;
  url: string;
};

type FolderItem = {
  name: string;
  type: "folder";
  items: (FileItem | FolderItem)[];
};

export const mockFilesAndFolders = [
  {
    name: "backend",
    type: "folder",
    items: [
      {
        name: "app",
        type: "folder",
        items: [
          {
            name: "config.py",
            type: "python",
            content: `from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()`,
            url: "mock-url",
          },
          {
            name: "database.py",
            type: "python",
            content: `from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()`,
            url: "mock-url",
          },
          {
            name: "main.py",
            type: "python",
            content: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, attendance
from .database import engine
from . import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(attendance.router)`,
            url: "mock-url",
          },
          {
            name: "models",
            type: "folder",
            items: [
              {
                name: "attendance.py",
                type: "python",
                content: `from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
from datetime import datetime

class Attendance(Base):
    __tablename__ = "attendances"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    check_in = Column(DateTime, default=datetime.utcnow)
    check_out = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="attendances")`,
                url: "mock-url",
              },
              {
                name: "user.py",
                type: "python",
                content: `from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    attendances = relationship("Attendance", back_populates="user")`,
                url: "mock-url",
              },
            ],
          },
          {
            name: "routes",
            type: "folder",
            items: [
              {
                name: "auth.py",
                type: "python",
                content: `from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from ..schemas.auth import UserCreate, UserLogin
from ..services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register")
async def register(user: UserCreate):
    return await AuthService.register_user(user)

@router.post("/login")
async def login(user: UserLogin):
    return await AuthService.login_user(user)`,
                url: "mock-url",
              },
            ],
          },
          {
            name: "schemas",
            type: "folder",
            items: [
              {
                name: "auth.py",
                type: "python",
                content: `from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str`,
                url: "mock-url",
              },
            ],
          },
          {
            name: "utils",
            type: "folder",
            items: [
              {
                name: "security.py",
                type: "python",
                content: `from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from ..config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)`,
                url: "mock-url",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "frontend",
    type: "folder",
    items: [
      {
        name: "app",
        type: "folder",
        items: [
          {
            name: "layout.tsx",
            type: "typescript",
            content: `import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}`,
            url: "mock-url",
          },
        ],
      },
      {
        name: "pages",
        type: "folder",
        items: [
          {
            name: "dashboard.tsx",
            type: "typescript",
            content: `'use client'
import { useEffect } from 'react'
import { useAttendanceStore } from '@/store/attendance'
import { AttendanceList } from '@/components/AttendanceList'

export default function Dashboard() {
  const { fetchAttendance } = useAttendanceStore()
  
  useEffect(() => {
    fetchAttendance()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <AttendanceList />
    </div>
  )
}`,
            url: "mock-url",
          },
        ],
      },
      {
        name: "services",
        type: "folder",
        items: [
          {
            name: "api.ts",
            type: "typescript",
            content: `import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const checkIn = async () => {
  const response = await api.post('/attendance/check-in')
  return response.data
}`,
            url: "mock-url",
          },
        ],
      },
      {
        name: "store",
        type: "folder",
        items: [
          {
            name: "attendance.ts",
            type: "typescript",
            content: `import create from 'zustand'
import { checkIn, checkOut } from '@/services/api'

interface AttendanceStore {
  isCheckedIn: boolean
  checkInTime: string | null
  checkOutTime: string | null
  checkInUser: () => Promise<void>
  checkOutUser: () => Promise<void>
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  isCheckedIn: false,
  checkInTime: null,
  checkOutTime: null,
  checkInUser: async () => {
    const response = await checkIn()
    set({ isCheckedIn: true, checkInTime: response.checkInTime })
  },
  checkOutUser: async () => {
    const response = await checkOut()
    set({ isCheckedIn: false, checkOutTime: response.checkOutTime })
  }
}))`,
            url: "mock-url",
          },
        ],
      },
      {
        name: "app.tsx",
        type: "typescript",
        content: `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)`,
        url: "mock-url",
      },
    ],
  },
];
