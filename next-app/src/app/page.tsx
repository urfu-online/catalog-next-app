'use client'

import { courses } from '@/src/app/data'
import { useState } from 'react'

export default function Home() {
  const [list, setList] = useState(courses)

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <div className="z-10 w-full max-w-5xl items-center justify-between lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:from-inherit lg:static lg:w-auto  lg:rounded-xl  lg:p-4 ">
          УрФУ.Онлайн
        </p>
      </div>

      {/*<div className="text-2xl my-10">*/}
      {/*  <h1>Онлайн-курсы УрФУ</h1>*/}
      {/*</div>*/}
      <div className="mb-12 max-w-5xl w-full">
        <label htmlFor="hs-trailing-button-add-on-with-icon-and-button" className="sr-only">
          Label
        </label>
        <div className="relative flex rounded-lg shadow-sm">
          <input
            type="text"
            id="hs-trailing-button-add-on-with-icon-and-button"
            name="hs-trailing-button-add-on-with-icon-and-button"
            className="py-3 px-4 ps-11 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Введите название курса"
            onChange={(e) => {
              setList(courses.filter((element) => element.title.toLowerCase().includes(e.target.value.toLowerCase())))
            }}
          />
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
            <svg
              className="shrink-0 size-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <button
            type="button"
            className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            Поиск
          </button>
        </div>
      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
        {list.map((course) => (
          <a
            href={course.link}
            className="m-3 group flex flex-col justify-between bg-white rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-col">
              <p className="m-1 text-sm self-end opacity-50">{course.platform}</p>

              <h2 className="mb-3 text-lg font-semibold">{course.title} </h2>
              <div className={'flex flex-wrap items-center'}>
                {course.tags.map((tag) => (
                  <p
                    key={tag}
                    className=" m-1 py-1 px-3 text-sm text-blue-800 border border-blue-800 border-solid rounded-lg"
                  >
                    {tag}
                  </p>
                ))}
              </div>
            </div>
            <p className="mt-8">
              Подробнее
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </p>
          </a>
        ))}
      </div>
    </main>
  )
}
