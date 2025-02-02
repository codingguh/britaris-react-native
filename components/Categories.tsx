import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import newsCategoryList from "@/constants/Categories";


type Props={
    onCategoryChanged:(category:string)=>void;
}

const Categories = ({onCategoryChanged}:Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<(TouchableOpacity | null)[]>(new Array(newsCategoryList.length).fill(null));
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectCategory = (index: number) => {
    const selected = itemRef.current[index];
    setActiveIndex(index);

    if (selected) {
      selected.measure((x, y, width, height, pageX) => {
        scrollRef.current?.scrollTo({ x: pageX, y: 0, animated: true });
      });
    }

    onCategoryChanged(newsCategoryList[index].slug)
  };



  return (
    <GestureHandlerRootView style={{ flex: 1,marginBottom:20, }}>
      <View>
        <Text style={styles.title}>Trending right now</Text>
        <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemsWrapper}>
          {newsCategoryList.map((item, index) => (
            <TouchableOpacity
              ref={(el) => (itemRef.current[index] = el)}
              onPress={() => handleSelectCategory(index)}
              key={index}
              style={[styles.items, activeIndex === index && styles.activeItem]}
            >
              <Text style={[styles.itemText, activeIndex === index && styles.activeText]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  title: {
    fontWeight: "600",
    color: Colors.black,
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 20,
  },
  itemsWrapper: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  items: {
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
  },
  itemText: {
    fontSize: 14,
    color: Colors.darkGrey,
    letterSpacing: 0.5,
  },
  activeItem: {
    backgroundColor: Colors.tint,
    borderColor:Colors.tint,
  },
  activeText: {
    color: Colors.white,
  },
});
