import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import type { ITaskResponse } from '@/types/task.types'

import { FILTERS } from './columns.data'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export const filterTasks = (
	tasks: ITaskResponse[] | undefined,
	value: string
) => {
	switch (value) {
		case 'today':
			return tasks?.filter(
				item =>
					dayjs(item.createAt).isSame(FILTERS.today, 'day') &&
					!item.isCompleted
			)

		case 'tomorrow':
			return tasks?.filter(
				item =>
					dayjs(item.createAt).isSame(FILTERS.tomorrow, 'day') &&
					!item.isCompleted
			)

		case 'on-this-week':
			return tasks?.filter(
				item =>
					!dayjs(item.createAt).isSame(FILTERS.today) &&
					!dayjs(item.createAt).isSame(FILTERS.tomorrow) &&
					dayjs(item.createAt).isSameOrBefore(FILTERS['on-this-week']) &&
					!item.isCompleted
			)

		case 'on-next-week':
			return tasks?.filter(
				item =>
					dayjs(item.createAt).isAfter(FILTERS['on-this-week']) &&
					dayjs(item.createAt).isSameOrBefore(FILTERS['on-next-week']) &&
					!item.isCompleted
			)

		case 'later':
			return tasks?.filter(
				item =>
					(dayjs(item.createAt).isAfter(FILTERS['on-next-week']) ||
						!item.createAt) &&
					!item.isCompleted
			)

		case 'completed':
			return tasks?.filter(item => item.isCompleted)

		default:
			return []
	}
}
