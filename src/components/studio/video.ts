export type VideoProvider = "youtube" | "bilibili";
export function videoDirective(provider: VideoProvider, input: string): string {
  let id = input.trim(),
    page = 1, start=0;
  if (/^https?:\/\//i.test(id)) {
    const url = new URL(id);
    if (url.username || url.password)
      throw new Error("视频地址不能包含登录凭证");
    const host = url.hostname.toLowerCase();
    if (provider === "youtube") {
      if (host === "youtu.be") id = url.pathname.slice(1);
      else if (
        [
          "youtube.com",
          "www.youtube.com",
          "m.youtube.com",
          "www.youtube-nocookie.com",
        ].includes(host)
      )
        id =
          url.searchParams.get("v") ||
          url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ||
          "";
      else throw new Error("请填写 YouTube 视频地址");
      const timestamp=url.searchParams.get('t')||url.searchParams.get('start')||'';
      if(timestamp){
        const match=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(timestamp);
        if(!match)throw new Error('视频开始时间无效');
        start=Number(match[1]||0)*3600+Number(match[2]||0)*60+Number(match[3]||0);
        if(start>86400)throw new Error('视频开始时间不能超过24小时');
      }
    } else {
      if (
        !["www.bilibili.com", "bilibili.com", "m.bilibili.com"].includes(host)
      )
        throw new Error("请填写 bilibili.com/video/ 视频地址或 BV/av 编号");
      id =
        url.pathname.match(/^\/video\/((?:BV[A-Za-z\d]{10})|(?:av\d+))/)?.[1] ||
        "";
      page = Number(url.searchParams.get("p") || 1);
    }
  }
  if (provider === "youtube" && !/^[A-Za-z\d_-]{11}$/.test(id))
    throw new Error("YouTube 视频 ID 应为 11 位");
  if (
    provider === "bilibili" &&
    (!/^(?:BV[A-Za-z\d]{10}|av\d{1,20})$/.test(id) ||
      !Number.isInteger(page) ||
      page < 1 ||
      page > 999)
  )
    throw new Error("请输入有效的 BV/av 编号及分 P");
  return `:::${provider} ${id}${provider === "bilibili" && page > 1 ? ` p=${page}` : provider==='youtube'&&start?` t=${start}`:""}`;
}
