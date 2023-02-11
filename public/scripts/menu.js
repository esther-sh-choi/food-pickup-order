$(() => {
  $(".collapsible").collapsible();

  const elems = $(".sidenav");
  const instances = M.Sidenav.init(elems, { edge: "right" });
});
