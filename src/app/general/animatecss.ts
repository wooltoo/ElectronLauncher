export class AnimateCSS {
    public static animate(element : string, animation : string) : Promise<string> {
        return new Promise((resolve, _reject) => {
          const node = document.querySelector(element);
          if (!node)
            return;
    
          node.classList.add('animated', animation);
          
          let handleAnimationEnd = () => {
            node.classList.remove('animated', animation);
            node.removeEventListener('animationend', handleAnimationEnd);
            resolve('ended');
          };
    
          node.addEventListener('animationend', handleAnimationEnd);
        });
      }
}