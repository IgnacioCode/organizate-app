import { getRequestContext } from "@cloudflare/next-on-pages"

export async function execute_query(DB, query, ...params) {
    let db_response = await DB.prepare(query).bind(...params).run();
    return db_response;
}

export async function get_user_id_by_email(email) {

    const query = "SELECT user_id FROM Users WHERE email=?";

    try {
        const DB = getRequestContext().env.DB;
        let db_response = await DB.prepare(query).bind(email).run();
        return db_response.results[0].user_id;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }

}

export async function get_plan_id_by_invitation_key(invite_key) {

    const query = "SELECT plan_id FROM Plans WHERE invite_key=?";

    try {
        const DB = getRequestContext().env.DB;
        let db_response = await DB.prepare(query).bind(invite_key).run();
        return db_response.results[0].plan_id;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
    
}

export async function get_plans_by_user_id(user_id) {

    const query = "SELECT pj.plan_id, p.user_id, name, date, description, CASE WHEN p.user_id=? THEN p.invite_key ELSE NULL END AS invite_key FROM PlansJoined pj JOIN Plans p ON pj.plan_id = p.plan_id WHERE pj.user_id=? ORDER BY date";
    
    try {
        const DB = getRequestContext().env.DB;
        let db_response = await DB.prepare(query).bind(user_id,user_id).run();
        return db_response.results;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }

}