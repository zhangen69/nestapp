import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'processesFilter' })
export class ProcessesFilterPipe implements PipeTransform {
    transform(processes: any[], eventPlanStatus: string) {
        if (processes && processes.length > 0) {
            if (eventPlanStatus === 'In Progress') {
                return processes.filter(process => process.type === 'Setup');
            } else {
                return processes.filter(process => process.type === eventPlanStatus);
            }
        }

        return processes;
    }
}
