import React, { use, useEffect } from 'react';
import MemberTable from '@/components/admin/member-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PaginationComponent from '@/components/admin/pagination';

export default function Members() {

  return(
    <div className="ps-10 pt-5">
      <div className="px-28 py-10 border rounded-lg shadow-1">
        <div>
          <h1 className='text-[28px] font-bold'>Members 👥</h1>
        </div>
        {/* <Button variant="outline" className="rounded-l-md bg-blue-300">+ Create Member</Button> */}
        <div className='mb-2'>
          <Input type='text' placeholder='Search members' className='w-[250px] mt-5' />
        </div>
        {/* member table  */}
        <div>
          <MemberTable />
        </div>
      </div>
    </div>
    
  )
}