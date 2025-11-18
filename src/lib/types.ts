export interface ExamData {
  qualification: string;
  componentCode: string;
  componentTitle: string;
  centreNumber: string;
  startTime: string;
  endTime: string;
  extraTime: number;
}

export type PresentationData = ExamData[];
