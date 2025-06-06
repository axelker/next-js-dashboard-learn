'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // Lib for debounce

export default function Search({ placeholder }: { placeholder: string }) {
  //Hook for manage the url params.
  const searchParams = useSearchParams();
  //Base path with out params
  const pathname = usePathname();
  // Router for update url
  const router = useRouter();

  const handleSearch = useDebouncedCallback((search:string) => {
    //Init with the url parameters
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (search) {
      params.set('query',search)
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`)
  },300)

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        // Use value if using state for manage form. This input manage manage itself
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}