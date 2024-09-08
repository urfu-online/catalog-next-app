'use client'

import { courses } from '@/src/app/data'
import { useState } from 'react'
import Image from 'next/image'
import {
  Card,
  Checkbox,
  Container,
  createTheme,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  ThemeProvider,
} from '@mui/material'
import Grid from '@mui/material/Grid2'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat',
  },
})

export default function Home() {
  const [list, setList] = useState(courses)
  const [category, setCategory] = useState({
    'Ядро бакалавриата': true,
    'Математика и ИТ': true,
    'Инженерные науки': true,
    'Экономика и управление': true,
    'Гуманитарные науки': true,
    'Естественные науки': true,
    'Искусственный интеллект': true,
    'Адаптационный модуль': true,
  })
  console.log(list)

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          py: 2,
          backgroundColor: 'rgba(214, 219, 220, .3)',
          position: 'sticky',
          top: 0,
          backdropFilter: 'blur(5px)',
          zIndex: 999,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={3}>
            <Image src="/urfu_logo.svg" alt="logo" width="275" height="80" className="pt-0.5" />
          </Grid>
          <Grid size={9}>
            <div className="w-full">
              <div className="relative flex rounded-lg shadow-sm">
                <input
                  type="text"
                  id="hs-trailing-button-add-on-with-icon-and-button"
                  name="hs-trailing-button-add-on-with-icon-and-button"
                  className="py-3 px-4 ps-10 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Введите название курса"
                  onChange={(e) => {
                    setList(
                      courses.filter((element) => element.title.toLowerCase().includes(e.target.value.toLowerCase())),
                    )
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid size={3}>
            <Paper sx={{ position: 'sticky', top: 86 }}>
              <FormControl sx={{ my: 2, ml: 2 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Категории</FormLabel>
                <FormGroup>
                  {Object.entries(category).map(([name, value]) => (
                    <FormControlLabel
                      key={name}
                      control={
                        <Checkbox
                          checked={value}
                          onChange={(e) => {
                            setCategory({ ...category, [name]: e.target.checked })
                          }}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label={name}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Paper>
          </Grid>
          <Grid size={9} container spacing={2} height={1}>
            {list
              .filter((course) =>
                Object.entries(category)
                  .filter(([_, value]) => value)
                  .some(([tagname, _]) => course.tags[tagname]),
              )
              .map((course, index) => (
                <Grid size={4} key={course.title + index}>
                  <Card sx={{ height: '100%' }}>
                    <a
                      href={course.link}
                      className="group flex flex-col justify-between bg-white  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-indigo-50 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 h-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex flex-col">
                        {course.platform == 'НПОО' ? (
                          <div className="mb-2 self-end">
                            <Image src="/openedu.png" className="inline" alt="НПОО" width={24} height={24} />{' '}
                            <span className="m-1 text-sm self-end opacity-50">{course.platform}</span>
                          </div>
                        ) : (
                          <div className="mb-2 self-end">
                            <Image className="inline" src="/urfu.png" alt="УрФУ" width={24} height={24} />
                            <span className="m-1 text-sm self-end opacity-50">{course.platform}</span>
                          </div>
                        )}
                        <hr />

                        <h2 className="mb-3 mt-2 text-md font-semibold">{course.title} </h2>
                        <div className={'mb-8 flex flex-wrap items-center'}>
                          {Object.entries(course.tags)
                            .filter(([_, value]) => value)
                            .map(([tag, _]) => (
                              <p
                                key={tag}
                                className=" m-1 py-1 px-3 text-xs text-blue-800 border border-blue-800 border-solid rounded-lg"
                              >
                                {tag}
                              </p>
                            ))}
                        </div>
                      </div>
                      <p>
                        Подробнее{' '}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          <ArrowForwardIcon fontSize="small" />
                        </span>
                      </p>
                    </a>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}
