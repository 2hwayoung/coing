'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { components } from '@/lib/api/generated/schema';
import { useAuth } from '@/context/AuthContext';
import { client } from '@/lib/api';
import RequireAuthenticated from '@/components/RequireAutenticated';
import { useBookmarkToggle } from '@/hooks/useBookmarkToggle'; // 훅 불러오기
import PaginationComponent from '@/components/Pagination';
import { MarketDto, PaginationDto, TickerDto } from '@/types';
import MarketCard from '../coin/components/MarketCard';
import { useRouter, useSearchParams } from 'next/navigation';

type BookmarkResponse = components['schemas']['BookmarkResponse'];

interface ClientPageProps {
  bookmarks: BookmarkResponse[];
}

export default function ClientPage({ bookmarks }: ClientPageProps) {
  const [pagination, setPagination] = useState<PaginationDto>({
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const { tickers: wsTickers, updateSubscriptions } = useWebSocket();
  const [tickers, setTickers] = useState<Record<string, TickerDto | null>>({});
  const { accessToken } = useAuth();

  // 기본 필터링: "KRW" (탭의 값으로 사용)
  const [quote, setQuote] = useState('KRW');
  const [size, setSize] = useState(9);
  const [loading, setLoading] = useState(false);
  const [bookmarksData, setBookmarksData] = useState<BookmarkResponse[]>(bookmarks);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);

  if (!accessToken) {
    return renderError('로그인이 필요합니다.');
  }

  // 북마크 목록 API 호출 (페이지나 quote가 변경될 때)
  useEffect(() => {
    async function fetchBookmarks() {
      if (!accessToken) return;
      setLoading(true);
      try {
        const { data, error } = await client.GET('/api/bookmarks/{quote}', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            path: { quote },
            query: {
              page: page - 1,
              size: size,
            },
          },
        });

        if (error || !data) {
          throw new Error('북마크 데이터를 불러오는 중 오류 발생');
        }
        setBookmarksData(data.content); // 북마크 데이터 업데이트
        setPagination(data);
      } catch (err) {
        console.error('북마크 데이터를 불러오는 중 오류 발생:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarks();
  }, [accessToken, page, quote]);

  // 북마크 데이터를 받은 후에만 `ticker` API 호출 (북마크가 업데이트된 후 실행)
  useEffect(() => {
    async function fetchInitialTickers() {
      try {
        if (marketCodes.length === 0) return; // 빈 배열이면 API 요청하지 않음

        const requestBody = {
          markets: marketCodes,
        };

        const { data, error } = await client.POST('/api/ticker', {
          body: requestBody,
        });

        if (error || !data || !data.tickers) {
          throw new Error('Ticker 데이터를 불러오는 중 오류 발생');
        }

        // ticker를 code 기반의 객체로 변환
        const tickerMap: Record<string, TickerDto> = (data.tickers as TickerDto[]).reduce(
          (acc, ticker) => {
            acc[ticker.code] = ticker;
            return acc;
          },
          {} as Record<string, TickerDto>,
        );

        setTickers(tickerMap);
      } catch (err) {
        console.error('Ticker 데이터를 불러오는 중 오류 발생:', err);
      }
    }

    if (bookmarksData.length > 0) {
      fetchInitialTickers();
    }
  }, [bookmarksData]); // 북마크 데이터가 변경되었을 때 실행

  // 웹소켓 데이터가 변경될 때 API에서 가져온 tickers를 웹소켓 데이터로 갱신
  useEffect(() => {
    if (Object.keys(wsTickers).length > 0) {
      setTickers((prevTickers) => ({
        ...prevTickers,
        ...wsTickers, // 기존 API 데이터에 웹소켓 데이터 덮어쓰기
      }));
    }
  }, [wsTickers]);

  // WebSocket 구독용 마켓 리스트를 useMemo로 계산 (불필요한 재계산 방지)
  const marketCodes = useMemo(() => {
    return bookmarksData.map((bookmark) => bookmark.code!).filter((code) => Boolean(code));
  }, [bookmarksData]);

  // 이전 구독 배열을 저장할 ref
  const prevMarketsRef = useRef<string[]>([]);

  // 마켓 리스트가 변경되었을 때만 구독 업데이트 실행
  useEffect(() => {
    if (marketCodes.length > 0) {
      const newMarketsJSON = JSON.stringify(marketCodes);
      const prevMarketsJSON = JSON.stringify(prevMarketsRef.current);
      if (newMarketsJSON !== prevMarketsJSON) {
        prevMarketsRef.current = marketCodes;
        updateSubscriptions([{ type: 'ticker', markets: marketCodes }]);
      }
    }
  }, [marketCodes, updateSubscriptions]);

  if (!accessToken) {
    return renderError('로그인이 필요합니다.');
  }
  if (loading) {
    return <div className="p-6 flex justify-center items-center">로딩 중...</div>;
  }
  if (!bookmarksData) {
    return renderError('북마크 데이터를 불러올 수 없습니다.');
  }

  // 페이지 변경 시 URL 업데이트
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // 탭 전환: quote 변경 시 페이지 리셋
  return (
    <div className="p-6">
      {/* 필터링 탭 */}
      <Tabs
        value={quote}
        onValueChange={(newQuote) => {
          setQuote(newQuote);
          setPage(1);
        }}
      >
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger className="cursor-pointer" value="KRW">
            KRW
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="BTC">
            BTC
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="USDT">
            USDT
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 북마크 코인 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mt-5 px-2">
        {bookmarksData.map((m) => {
          const market: MarketDto = {
            code: m.code!, // code가 undefined가 아니어야 함
            koreanName: m.koreanName!,
            englishName: m.englishName!,
            isBookmarked: m.isBookmarked ?? false, // 기본값 false 처리
          };

          const handleBookmarkToggle = useBookmarkToggle(market);

          return (
            <MarketCard
              key={market.code}
              market={market}
              ticker={tickers[market.code]}
              onBookmarkToggle={handleBookmarkToggle}
            />
          );
        })}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6">
        <PaginationComponent
          currentPage={page}
          totalPages={pagination.totalPages ?? 1}
          maxPageButtons={5}
          onPageChange={handlePageChange}
          size={size}
          onSizeChange={(newSize) => setSize(newSize)}
          totalElements={pagination.totalElements ?? 0}
          pageSizeList={[9, 15, 21]}
        />
      </div>
    </div>
  );
}

// 에러 메시지 렌더링 함수
function renderError(message: string) {
  return (
    <RequireAuthenticated>
      <div className="p-6 flex justify-center items-center">
        <p className="text-red-500">{message}</p>
      </div>
    </RequireAuthenticated>
  );
}
