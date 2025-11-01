export interface Politician {
  mp_election_index?: string;
  mp_index?: string;
  mp_name: string;
  nature_membership?: string;
  term_start_date?: string;
  term_end_date?: string;
  term: string;
  pc_name: string;
  state: string;
  mp_political_party: string;
  mp_gender: string;
  educational_qualification: string;
  educational_qualification_details?: string;
  mp_age: string;
  debates?: string;
  ag_debates?: string;
  private_member_bills?: string;
  ag_private_member_bills?: string;
  questions?: string;
  ag_questions?: string;
  attendance?: string;
  avg_attendance?: string;
  mp_note?: string;
  mp_house: string;
  [key: string]: any;
}