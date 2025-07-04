import React from 'react';
import { useParams, Outlet, Link, useLocation } from 'react-router-dom';
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSpace } from '@/context/SpaceContext';
import { useAuth } from '@/context/AuthContext';

// 경로에 따른 한글 이름 매핑
const pathToKorean: { [key: string]: string } = {
  resume: '이력서 & 포트폴리오',
  resumes: '이력서',
  portfolios: '포트폴리오',
  interview: '기술 면접',
  coding: '코딩 테스트',
  settings: '설정',
  share: '이력서 공유',
  schedule: '일정 관리',
  questions: '공부하기',
  contests: '시험보기',
  notes: '필기노트',
  problems: '문제 풀기',
  'wrong-notes': '오답 노트',
  new: '새로 만들기',
  detail: '상세 보기',
  edit: '수정하기',
  test: '시험 시작',
};

// 대시보드 메인 컴포넌트
export default function Dashboard() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { currentSpace } = useSpace();
  const { isGuest } = useAuth();
  const location = useLocation();

  // 현재 경로를 배열로 분리
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // 'space'와 spaceId는 breadcrumb에서 제외
  let filteredSegments = pathSegments;
  const spaceIdx = pathSegments.findIndex(seg => seg === 'space');
  if (spaceIdx !== -1 && pathSegments.length > spaceIdx + 1) {
    filteredSegments = pathSegments.slice(spaceIdx + 2); // 'space'와 spaceId 건너뜀
  }

  // 이력서 ID 제외
  if (filteredSegments.includes('resumes')) {
    const resumesIdx = filteredSegments.findIndex(seg => seg === 'resumes');
    if (resumesIdx !== -1 && filteredSegments.length > resumesIdx + 1) {
      // 이력서 ID는 항상 제외
      filteredSegments = [
        ...filteredSegments.slice(0, resumesIdx + 1),
        ...filteredSegments.slice(resumesIdx + 2)
      ];
    }
  }

  // 포트폴리오 ID 제외
  if (filteredSegments.includes('portfolios')) {
    const portfoliosIdx = filteredSegments.findIndex(seg => seg === 'portfolios');
    if (portfoliosIdx !== -1 && filteredSegments.length > portfoliosIdx + 1) {
      // 포트폴리오 ID는 항상 제외
      filteredSegments = [
        ...filteredSegments.slice(0, portfoliosIdx + 1),
        ...filteredSegments.slice(portfoliosIdx + 2)
      ];
    }
  }

  // 문제 ID를 "문제풀기"로 변경
  if (filteredSegments.includes('questions')) {
    const questionsIdx = filteredSegments.findIndex(seg => seg === 'questions');
    if (questionsIdx !== -1 && filteredSegments.length > questionsIdx + 1) {
      filteredSegments = [
        ...filteredSegments.slice(0, questionsIdx + 1),
        '문제풀기'
      ];
    }
  }

  // 대회 ID를 "조회"로 변경
  if (filteredSegments.includes('contests')) {
    const contestsIdx = filteredSegments.findIndex(seg => seg === 'contests');
    if (contestsIdx !== -1 && filteredSegments.length > contestsIdx + 1) {
      filteredSegments = [
        ...filteredSegments.slice(0, contestsIdx + 1),
        '조회'
      ];
    }
  }

  // breadcrumb 항목 생성
  const breadcrumbItems = filteredSegments.map((segment, index) => {
    const path = `/space/${spaceId}/` + filteredSegments.slice(0, index + 1).join('/');
    const isLast = index === filteredSegments.length - 1;
    const koreanName = pathToKorean[segment] || segment;

    if (isLast) {
      return (
        <BreadcrumbItem key={path}>
          <BreadcrumbPage>{koreanName}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    return (
      <React.Fragment key={path}>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={path}>{koreanName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </React.Fragment>
    );
  });

  // 스페이스 ID가 URL 파라미터로 주어진 경우 localStorage에 저장
  if (spaceId) {
    localStorage.setItem('activeSpaceId', spaceId);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/space/${spaceId}`}>
                      {currentSpace?.spaceName || '스페이스'}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems.length > 0 && (
                  <>
                    <BreadcrumbSeparator />
                    {breadcrumbItems}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}